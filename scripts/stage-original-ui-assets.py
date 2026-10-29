#!/usr/bin/env python3
"""Stage byte-identical original ACFUN UI files outside original PHP webroot.

The source archive is the immutable, privately verified baseline.
No web publishing or Cloudflare production routing takes place here.
"""
from pathlib import Path,PurePosixPath
import argparse,hashlib,json,tarfile
def stage(archive:Path,destination:Path)->dict[str,object]:
    manifest=json.loads((archive/"full-ui-manifest.json").read_text("utf-8"))
    files={x["path"]:x for x in manifest["files"]}
    destination.mkdir(mode=0o700,parents=True,exist_ok=True)
    written=0;total=0;seen=set()
    with tarfile.open(archive/"original-full-ui-only.tar.gz","r:gz") as tf:
        for member in tf:
            if not member.isfile():continue
            rel=member.name.lstrip("./")
            path=PurePosixPath(rel)
            if rel not in files or path.is_absolute() or '..' in path.parts:
                raise ValueError("Unrecognized archive path")
            if rel in seen:raise ValueError("Duplicate archive path")
            seen.add(rel)
            target=destination.joinpath(*path.parts)
            # Require no existing symlink in any intermediate component.
            parent=destination
            for part in path.parts[:-1]:
                parent=parent/part
                if parent.is_symlink():raise ValueError("Symlink directory refused")
                parent.mkdir(mode=0o700,exist_ok=True)
            if target.is_symlink():raise ValueError("Symlink file refused")
            payload=tf.extractfile(member).read()
            expected=files[rel]
            if len(payload)!=expected["bytes"] or hashlib.sha256(payload).hexdigest()!=expected["sha256"]:
                raise ValueError("Source archive integrity mismatch")
            if target.exists() and target.read_bytes()!=payload:raise ValueError("Existing stage drift detected")
            target.write_bytes(payload)
            target.chmod(0o600)
            written+=1;total+=len(payload)
    if len(seen)!=len(files):raise ValueError("Missing original UI files")
    return {"staged":written,"bytes":total,"missing":len(files)-len(seen),"originalUnmodified":True,
            "productionWorkerUnmodified":True}
if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--archive-dir",required=True,type=Path)
    parser.add_argument("--stage-dir",required=True,type=Path)
    args=parser.parse_args()
    if args.stage_dir.resolve().is_relative_to(Path("/www/wwwroot").resolve()):
        raise SystemExit("Refusing to write to PHP production webroot")
    print(json.dumps(stage(args.archive_dir,args.stage_dir),ensure_ascii=False))