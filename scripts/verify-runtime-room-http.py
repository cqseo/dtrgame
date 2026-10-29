"""Real isolated Worker + Supabase waiting-room test; never prints credentials."""
import base64, concurrent.futures, gzip, http.cookies, json, sys, time, re, urllib.request, urllib.parse, urllib.error
BASE='https://dtrgame-original-runtime-qa-20261029.dearpassengerscrew-new.workers.dev'
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*args): return None
class Player:
    def __init__(self): self.cookies={}
    def call(self,path,data=None):
        headers={'User-Agent':'Mozilla/5.0 DTS-Isolated-QA/1.0','Cookie':'; '.join(k+'='+v for k,v in self.cookies.items())}
        if data is not None: headers['Content-Type']='application/x-www-form-urlencoded'
        req=urllib.request.Request(BASE+path,headers=headers,data=None if data is None else urllib.parse.urlencode(data).encode())
        try: response=urllib.request.build_opener(NoRedirect).open(req,timeout=40)
        except urllib.error.HTTPError as e: response=e
        with response:
            body=response.read()
            for item in response.headers.get_all('Set-Cookie',[]):
                parsed=http.cookies.SimpleCookie();parsed.load(item)
                for k,v in parsed.items(): self.cookies[k]=v.value
            return response.status,body,response.headers
    def poll(self,stamp=0):
        status,body,_=self.call('/roomupdate.php',{'timestamp':stamp})
        assert status==200,f'poll status {status}'
        return json.loads(gzip.decompress(base64.b64decode(body))) if body else None
accounts=json.load(open(sys.argv[1]));players=[Player(),Player()]
for p,a in zip(players,accounts):
    status,_,_=p.call('/login.php',{'username':a['username'],'password':a['password']})
    assert status==302,f'login {status}'
a,b=players
status,body,_=a.call('/index.php');assert status==200 and '房间列表'.encode() in body,f'lobby {status}'
status,_,_=a.call('/roomcmd.php?command=newroom&para1=14');assert status==302,f'create {status}'
roomid=a.cookies.get('acbra2_roomid');assert roomid and roomid!='0'
try:
    status,body,_=a.call('/index.php');assert status==200 and b'id="roomcmd"' in body and b'room_get_update()' in body,f'room lobby {status}'
    status,_,_=b.call('/roomcmd.php?command=enterroom&para1='+roomid);assert status==302,f'join {status}'
    first=b.poll();assert '进入位置' in first['innerHTML']['roommain']
    stamp=first['value']['timestamp']
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        pending=pool.submit(a.poll,stamp)
        time.sleep(1)
        status,_,_=b.call('/roomcmd.php',{'command':'pos_enter','para1':1});assert status==200,f'seat {status}'
        update=pending.result()
    assert update and update['value']['timestamp']>stamp
    html=update['innerHTML']['roommain']
    assert accounts[0]['username'] in html and accounts[1]['username'] in html and 'roomkick_timer' in html
    # Both independently issue real DB writes, under the shared room lock.
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        statuses=list(pool.map(lambda args:args[0].call('/roomcmd.php',{'command':'newchat','para1':args[1]})[0],[(a,'QA_PARALLEL_A'),(b,'QA_PARALLEL_B')]))
    assert statuses==[200,200]
    update=a.poll();messages=''.join(x['data'] for x in update['lastchat'])
    assert 'QA_PARALLEL_A' in messages and 'QA_PARALLEL_B' in messages
    status,_,_=a.call('/roomcmd.php',{'command':'ready'});assert status==200,f'ready {status}'
    before_time=time.time();before=b.poll()
    status,_,_=b.call('/roomcmd.php',{'command':'ready'});assert status==501,f'incomplete start must fail, got {status}'
    after=b.poll()
    assert before['value']==after['value'] and before['lastchat']==after['lastchat'],'incomplete start changed stored room state'
    timer=r'(<span id="roomkick_timer">)(\d+)(</span>)'
    before_html=before['innerHTML']['roommain'];after_html=after['innerHTML']['roommain']
    old_timer=int(re.search(timer,before_html).group(2));new_timer=int(re.search(timer,after_html).group(2))
    assert 0<=old_timer-new_timer<=int(time.time()-before_time)+1
    assert re.sub(timer,r'\1CLOCK\3',before_html)==re.sub(timer,r'\1CLOCK\3',after_html),'incomplete start changed ready markup'
    print(json.dumps({'pass':True,'roomId':int(roomid),'twoRealAccounts':True,'createJoinSeat':True,'pollWokeOnMutation':True,'concurrentChatPersistence':True,'firstReady':True,'incompleteStartRolledBack':True,'gamePlayable':False}))
finally:
    for p in players:
        status,_,_=p.call('/roomcmd.php?command=leave')
        if status!=302: print('cleanup_status',status,file=sys.stderr)
