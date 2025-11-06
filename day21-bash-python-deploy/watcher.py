#!/usr/bin/env python3
"""watcher.py

Small healthcheck and restart helper. Uses only Python standard library.

Examples:
  python3 watcher.py --health-url http://localhost:8080/health --restart-cmd "sudo systemctl restart myapp"

"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
from datetime import datetime
from typing import Optional

try:
    # Python 3 stdlib http client
    from urllib.request import urlopen, Request
    from urllib.error import URLError, HTTPError
except Exception:
    urlopen = None  # type: ignore


def now_iso() -> str:
    return datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")


def log(path: str, *parts: object) -> None:
    line = f"[{now_iso()}] " + " ".join(map(str, parts))
    with open(path, "a", encoding="utf-8") as fh:
        fh.write(line + "\n")
    print(line)


def http_healthcheck(url: str, timeout: float = 3.0) -> bool:
    req = Request(url, headers={"User-Agent": "watcher/1.0"})
    try:
        with urlopen(req, timeout=timeout) as resp:  # type: ignore
            code = getattr(resp, "status", None) or getattr(resp, "getcode", lambda: None)()
            return 200 <= int(code) < 500
    except Exception:
        return False


def cmd_healthcheck(cmd: str) -> bool:
    try:
        res = subprocess.run(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return res.returncode == 0
    except Exception:
        return False


def run_restart(cmd: str, timeout: Optional[int] = None) -> bool:
    if not cmd:
        return False
    try:
        proc = subprocess.run(cmd, shell=True)
        return proc.returncode == 0
    except Exception:
        return False


def write_status(path: str, status: dict) -> None:
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(status, fh, indent=2)


def main(argv: Optional[list[str]] = None) -> int:
    p = argparse.ArgumentParser(description="Simple healthcheck watcher and restart helper")
    p.add_argument("--health-url", help="URL to poll for health (HTTP GET)")
    p.add_argument("--health-cmd", help="Command to run for health check (alternative to URL)")
    p.add_argument("--restart-cmd", help="Command to run to restart the service")
    p.add_argument("--retries", type=int, default=5, help="Healthcheck retries before attempting restart")
    p.add_argument("--wait", type=float, default=2.0, help="Seconds between retries")
    p.add_argument("--timeout", type=float, default=3.0, help="HTTP timeout for healthchecks")
    p.add_argument("--log-file", default="deploy.log", help="Path to append textual logs")
    p.add_argument("--status-file", default="deploy.status.json", help="Write JSON status here")
    p.add_argument("--dry-run", action="store_true")

    args = p.parse_args(argv)

    log_path = args.log_file
    status_path = args.status_file

    status = {"started_at": now_iso(), "health_ok": False, "retries": 0, "events": []}
    write_status(status_path, status)

    # Determine health check function
    if args.health_cmd:
        check = lambda: cmd_healthcheck(args.health_cmd)
    elif args.health_url:
        check = lambda: http_healthcheck(args.health_url, timeout=args.timeout)
    else:
        print("Either --health-url or --health-cmd must be provided", file=sys.stderr)
        return 2

    # Poll
    for i in range(args.retries):
        ok = check()
        status["retries"] = i
        if ok:
            status["health_ok"] = True
            status["ok_at"] = now_iso()
            status["events"].append({"ts": now_iso(), "msg": "healthy"})
            write_status(status_path, status)
            log(log_path, "Healthcheck passed on attempt", i + 1)
            return 0
        else:
            status["events"].append({"ts": now_iso(), "msg": f"not healthy (attempt {i + 1})"})
            write_status(status_path, status)
            log(log_path, f"Healthcheck failed (attempt {i + 1}/{args.retries})")
            time.sleep(args.wait)

    # If we get here, healthchecks all failed
    log(log_path, "Healthcheck failed after retries")
    status["health_ok"] = False
    status["events"].append({"ts": now_iso(), "msg": "attempting restart"})
    write_status(status_path, status)

    if args.dry_run:
        log(log_path, "Dry-run mode, not running restart")
        return 3

    if args.restart_cmd:
        log(log_path, f"Running restart command: {args.restart_cmd}")
        ok = run_restart(args.restart_cmd)
        status["events"].append({"ts": now_iso(), "msg": f"restart {'succeeded' if ok else 'failed'}"})
        write_status(status_path, status)
        if not ok:
            log(log_path, "Restart command failed")
            return 4

        # After restart, give service some time and re-check
        time.sleep(args.wait)
        for i in range(args.retries):
            ok = check()
            if ok:
                status["health_ok"] = True
                status["ok_after_restart_at"] = now_iso()
                status["events"].append({"ts": now_iso(), "msg": f"healthy after restart (attempt {i + 1})"})
                write_status(status_path, status)
                log(log_path, "Service healthy after restart")
                return 0
            else:
                status["events"].append({"ts": now_iso(), "msg": f"still not healthy (attempt {i + 1})"})
                write_status(status_path, status)
                time.sleep(args.wait)

        log(log_path, "Service still unhealthy after restart")
        return 5
    else:
        log(log_path, "No restart command provided — giving up")
        return 6


if __name__ == "__main__":
    raise SystemExit(main())
