#!/usr/bin/env python3
"""Multi-session PostgreSQL drills, restricted to the disposable QA container.
No network credentials, production database URL, registration or real accounts.
"""
import concurrent.futures
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

CONTAINER = 'dtr-settlement-qa-20261102'
DATABASE = os.environ.get('DTR_QA_DATABASE','dtr_original_full_qa_20261102')
if not re.fullmatch(r'dtr_original_[a-z0-9_]+',DATABASE):raise SystemExit('Only disposable dtr_original_* QA database names are accepted.')
ROOT = Path(__file__).resolve().parents[1]
DIGEST = 'a' * 64
REQUEST = '00000000-0000-4000-8000-000000000001'
OTHER = '00000000-0000-4000-8000-000000000002'

def command(sql, application='dtr_qa', check=True):
    result = subprocess.run(['docker','exec','-i','-e','PGAPPNAME='+application,CONTAINER,
        'psql','-U','postgres','-d',DATABASE,'-Atq','-v','ON_ERROR_STOP=1'],
        input=sql.encode(),capture_output=True)
    if check and result.returncode:
        raise RuntimeError(result.stderr.decode()[:600])
    return result

def scalar(sql):
    return command(sql).stdout.decode().strip()

def quote(value):
    return "'"+json.dumps(value,ensure_ascii=False,separators=(',',':')).replace("'","''")+"'::jsonb"

def load():
    return json.loads(scalar('select public.dtr_original_load();'))

def reset():
    command("truncate public.acbra2_users,public.acbra2_game,public.acbra2_chat,dtr_runtime.original_match_endings,dtr_runtime.original_request_receipts restart identity cascade;"
        "update dtr_runtime.original_control set enabled=true,revision=0,files='{}',directories='[]',counters='{}';"
        "insert into public.acbra2_users(username,gold) values('Alpha',10),('Beta',20);"
        "insert into public.acbra2_game(groomid,gamenum,starttime,gamestate) values(0,7,100,30);")
    return load()

def commit_sql(snapshot, gold=130, request=REQUEST):
    row={**snapshot['tables']['acbra2_users'][0],'gold':gold}
    changes=[{'operation':'upsert','table':'acbra2_users','key':{'uid':row['uid']},'row':row}]
    files={'gamedata/replays/7.dat':{'content':'synthetic archive','mtime':200}}
    return 'select public.dtr_original_commit('+','.join([
        "'"+request+"'","'"+DIGEST+"'",str(snapshot['revision']),"'"+snapshot['signature']+"'",
        quote(changes),quote(files),quote(['gamedata/replays']),quote(snapshot['counters']),quote({'status':200,'headers':[],'body':'synthetic original response'})])+');'

def reconcile_sql(snapshot):
    return "select public.dtr_original_reconcile('"+REQUEST+"','"+DIGEST+"',"+str(snapshot['revision'])+');'

def gold():
    return int(scalar("select gold from public.acbra2_users where username='Alpha';"))

def receipt_count():
    return int(scalar('select count(*) from dtr_runtime.original_request_receipts;'))

def wait_sleep(application):
    deadline=time.monotonic()+4
    while time.monotonic()<deadline:
        if scalar("select count(*) from pg_stat_activity where datname='"+DATABASE+"' and application_name='"+application+"' and wait_event='PgSleep';")=='1':
            return
        time.sleep(0.03)
    raise RuntimeError('QA session did not reach its lock-holding barrier')

def passed(name):
    print('PASS '+name,flush=True)

exists=subprocess.run(['docker','exec',CONTAINER,'psql','-U','postgres','-d','postgres','-Atqc',
    "select count(*) from pg_database where datname='"+DATABASE+"'"],capture_output=True,check=True).stdout.strip()
if exists!=b'0':
    raise SystemExit('Refusing to overwrite an existing QA database; use a fresh test cluster or remove only this disposable QA database explicitly.')
subprocess.run(['docker','exec',CONTAINER,'createdb','-U','postgres',DATABASE],check=True,capture_output=True)
for role in ['anon','authenticated','service_role']:
    command("do $$begin if not exists(select from pg_roles where rolname='"+role+"') then create role "+role+";end if;end$$;")
command((ROOT/'src/generated/legacy-schema.sql').read_text())
command((ROOT/'supabase/migrations/20261102171000_original_full_request_transactions.sql').read_text())
command((ROOT/'supabase/migrations/20261102183000_original_room_slots.sql').read_text())
assert scalar('select enabled from dtr_runtime.original_control;')=='f'
passed('migration installs disabled on PostgreSQL '+scalar('show server_version;'))

with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
    snapshot=reset();sql=commit_sql(snapshot)
    replies=list(pool.map(lambda _:json.loads(scalar(sql)),range(2)))
    assert all(r['ok'] for r in replies) and sorted(r['replayed'] for r in replies)==[False,True]
    assert gold()==130 and receipt_count()==1
    passed('two real sessions, same request: one award and one replayed receipt')

    snapshot=reset()
    futures=[pool.submit(scalar,commit_sql(snapshot,130,REQUEST)),pool.submit(scalar,commit_sql(snapshot,999,OTHER))]
    replies=[json.loads(f.result()) for f in futures]
    assert sum(r['ok'] for r in replies)==1 and sum(bool(r.get('conflict')) for r in replies)==1
    assert gold() in (130,999) and receipt_count()==1
    passed('two competing sessions: stale full snapshot cannot overwrite the winner')

    snapshot=reset()
    held=pool.submit(command,'begin;'+reconcile_sql(snapshot)+'select pg_sleep(0.4);commit;','dtr_recovery_fence')
    wait_sleep('dtr_recovery_fence')
    late=pool.submit(scalar,commit_sql(snapshot));held.result()
    assert json.loads(late.result())['conflict'] and gold()==10 and receipt_count()==0
    passed('recovery wins lock first and fences an actually delayed commit')

    snapshot=reset()
    held=pool.submit(command,'begin;'+commit_sql(snapshot)+'select pg_sleep(0.4);commit;','dtr_commit_hold')
    wait_sleep('dtr_commit_hold')
    recovering=pool.submit(scalar,reconcile_sql(snapshot));held.result()
    assert json.loads(recovering.result())['replayed'] and gold()==130 and receipt_count()==1
    passed('recovery waits for in-flight commit and returns its original receipt')

    snapshot=reset()
    held=pool.submit(command,'begin;'+commit_sql(snapshot)+'select pg_sleep(30);commit;','dtr_kill_transaction',False)
    wait_sleep('dtr_kill_transaction')
    scalar("select pg_terminate_backend(pid) from pg_stat_activity where datname='"+DATABASE+"' and application_name='dtr_kill_transaction';")
    assert held.result().returncode!=0
    assert gold()==10 and receipt_count()==0 and load()==snapshot
    passed('backend termination before COMMIT rolls back rows, files, counters and receipt')

snapshot=reset()
dump=subprocess.run(['docker','exec',CONTAINER,'pg_dump','-U','postgres','-Fc',DATABASE],capture_output=True,check=True).stdout
scalar(commit_sql(snapshot));assert gold()==130
restored=subprocess.run(['docker','exec','-i',CONTAINER,'pg_restore','-U','postgres','--clean','--if-exists','-d',DATABASE],input=dump,capture_output=True)
if restored.returncode:raise RuntimeError(restored.stderr.decode()[:600])
assert gold()==10 and receipt_count()==0 and load()==snapshot
passed('pg_dump/pg_restore restores the exact pre-commit full snapshot and identity state')
command('update dtr_runtime.original_control set enabled=false;')
command((ROOT/'supabase/migrations/20261102190000_original_writer_cutover.sql').read_text())
assert command("select public.dtr_original_set_mode('original');",check=False).returncode!=0
scalar("select public.dtr_original_set_mode('paused');")
for sql in ["update public.acbra2_users set gold=999","delete from public.acbra2_users","truncate public.acbra2_users"]:
    result=command(sql,check=False)
    assert result.returncode!=0 and b'complete transaction boundary' in result.stderr
passed('real PostgreSQL paused cutover blocks old update/delete/truncate writers')

scalar("select public.dtr_original_set_mode('original');")
snapshot=load();assert json.loads(scalar(commit_sql(snapshot)))['ok'] and gold()==130
command("create function public.dtr_qa_old_writer()returns void language sql security definer set search_path='' as $$update public.acbra2_users set gold=999$$;")
assert command('select public.dtr_qa_old_writer();',check=False).returncode!=0
passed('complete commit succeeds; an older SECURITY DEFINER RPC remains fenced')

snapshot=load();row={**snapshot['tables']['acbra2_users'][0],'uid':5,'username':'Gamma'}
changes=[{'operation':'upsert','table':'acbra2_users','key':{'uid':5},'row':row}]
counters={**snapshot['counters'],'acbra2_users':9}
sql='select public.dtr_original_commit('+','.join([
    "'"+OTHER+"'","'"+DIGEST+"'",str(snapshot['revision']),"'"+snapshot['signature']+"'",
    quote(changes),quote(snapshot['files']),quote(snapshot['directories']),quote(counters),quote({'status':200,'headers':[],'body':'synthetic account allocation'})])+');'
assert json.loads(scalar(sql))['ok']
scalar("select public.dtr_original_set_mode('paused');")
scalar("select public.dtr_original_set_mode('legacy');")
assert scalar("insert into public.acbra2_users(username)values('Delta')returning uid;")=='10'
passed('rollback to legacy restores allocator high-water mark, including unused original ids')

scalar("select public.dtr_original_set_mode('paused');")
scalar("select public.dtr_original_set_mode('original');")
assert load()['counters']['acbra2_users']==10
scalar("select public.dtr_original_set_mode('paused');")
assert scalar('select enabled from dtr_runtime.original_control;')=='f'
passed('re-entering original mode recollects later legacy identities; final state paused')
print(json.dumps({'ok':True,'database':DATABASE,'cases':11,'gate_after_drill':'disabled','writer_mode_after_drill':'paused','real_player_data':False}),flush=True)
