#!/usr/bin/env python3
"""Read-only original ACFUN DTS UI snapshot verifier.

Never regenerates, resizes or replaces source images/templates.
Reads the existing private manifest and original-only tar.gz baseline.
Designed for CI on the authorized source snapshot server.
"""
from __future__ import annotations
from pathlib import Path
import argparse
import collections
import hashlib
import json
import sys
import tarfile

def verify(path:Path)->dict[str,object]:
    manifest=json.loads((path/"full-ui-manifest.json").read_text(encoding="utf-8"))
    expected={entry["path"]:entry for entry in manifest["files"]}
    matched=set()
    kinds=collections.Counter()
    problems=[]
    nbytes=0
    with tarfile.open(path/"original-full-ui-only.tar.gz","r:gz") as archive:
        for member in archive:
            if not member.isfile():
                continue
            name=member.name.lstrip("./")
            record=expected.get(name)
            if not record:
                problems.append("unexpected:" + name)
                continue
            if name in matched:
                problems.append("duplicate:" + name)
                continue
            stream=archive.extractfile(member)
            if stream is None:
                problems.append("unreadable:" + name)
                continue
            sha=hashlib.sha256()
            while chunk:=stream.read(1024*1024):
                sha.update(chunk)
                nbytes+=len(chunk)
            if sha.hexdigest()!=record["sha256"] or member.size!=record["bytes"]:
                problems.append("different:" + name)
            matched.add(name)
            kinds[Path(name).suffix.lower() or "[noext]"]+=1
    for missing in expected.keys()-matched:
        problems.append("missing:" + missing)
    return {
        "pass":not problems,
        "manifestFiles":len(expected),
        "verifiedFiles":len(matched),
        "uncompressedBytes":nbytes,
        "templateHtm":kinds[".htm"],
        "png":kinds[".png"],
        "gif":kinds[".gif"],
        "problemsCount":len(problems),
        # Avoid leaking filesystem paths or contents of hidden original assets.
    }
def main()->int:
    p=argparse.ArgumentParser()
    p.add_argument("--archive-dir",required=True,type=Path)
    args=p.parse_args()
    result=verify(args.archive_dir)
    print(json.dumps(result,ensure_ascii=False))
    return 0 if result["pass"] else 1
if __name__=="__main__":
    sys.exit(main())