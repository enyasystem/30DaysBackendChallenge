# Day 21 — Deployment Script (Bash + Python watcher)

Lightweight deploy helper that performs a git update and restarts a service, plus a small Python "watcher" that performs health checks and graceful restarts.

Goals
- Provide a simple `deploy.sh` you can run from a CI job or cron to update a project directory.
- Provide `watcher.py` (pure Python stdlib) to perform health checks, run restart commands, and wait for services to become healthy.

Prerequisites
- Bash (Linux/macOS)
- Git
- Python 3.8+ (standard library only)

Files
- `deploy.sh` — main deploy script (git pull, optional build, restart hook, logging)
- `watcher.py` — Python helper: healthchecks, retries, logging, status file
- `tests/test_watcher.py` — small stdlib `unittest` test for the watcher healthcheck

Quick examples

Run a dry-run deploy for `/var/www/myapp` on branch `main` and only print steps:

```bash
./deploy.sh --dir /var/www/myapp --branch main --dry-run
```

Perform the deploy, run a build command, restart using systemctl, and then verify via a health URL using the watcher:

```bash
./deploy.sh --dir /var/www/myapp \
  --branch main \
  --pre-cmd "npm ci" \
  --build-cmd "npm run build" \
  --restart-cmd "sudo systemctl restart myapp.service" \
  --health-url "http://localhost:8080/health" \
  --watcher ./watcher.py
```

Running tests (uses Python stdlib unittest):

```bash
python3 -m unittest discover -q day21-bash-python-deploy/tests
```

Notes
- `watcher.py` intentionally uses only the Python standard library to avoid extra dependencies.
- `deploy.sh` is conservative: it refuses to overwrite local changes unless `--force` is passed.

License: same as project
