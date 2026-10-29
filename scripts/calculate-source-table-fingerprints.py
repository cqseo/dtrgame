#!/usr/bin/env python3
"""Private original DTS per-table multiset digest; prints NO player fields."""
from pathlib import Path
import gzip, json, hashlib
base=Path('/opt/dts-port-workbench-20261029')
snapshot=Path('/opt/dts-sandbox/backups/mysql-original-20261029/20261029-021530-79131')
meta=json.loads((base/'all-tables-schema-metadata.json').read_text())['tables']
manifest=json.loads((snapshot/'manifest.json').read_text())
result={}
for item in manifest['tables']:
 name=item['table']
 columns=[x['COLUMN_NAME'] for x in meta[name]]
 rh=[]
 with gzip.open(snapshot/(name+'.jsonl.gz'),'rt',encoding='utf8') as stream:
  for line in stream:
   row=json.loads(line)
   raw=b''.join(b'N;' if row[col] is None else (str(len(row[col].encode('utf8'))).encode()+b':'+row[col].encode('utf8')+b';') for col in columns)
   rh.append(hashlib.sha256(raw).hexdigest())
 assert len(rh)==item['rows']
 digest=hashlib.sha256('\n'.join(sorted(rh)).encode('ascii')).hexdigest()
 result[name]={'count':len(rh),'fields':len(columns),'digest':digest}
out=base/'private-per-table-source-fingerprints.json'
out.write_text(json.dumps(result,indent=2))
out.chmod(0o600)
print('SOURCE_PER_TABLE_FINGERPRINTS_DONE',len(result),'ROWS',sum(x['count']for x in result.values()),'NO_DATA_EXPORTED')