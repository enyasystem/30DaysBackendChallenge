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

Optional: Auto-deploy from GitHub

If you want GitHub to trigger deployments for this repository (for example to a VPS you control), you can use the included GitHub Actions workflow template `.github/workflows/deploy_day21.yml` (see repo root). The workflow needs SSH access to the target host — set the following repository secrets in GitHub:

- `DEPLOY_HOST` — host or IP of the target server
- `DEPLOY_USER` — SSH user
- `DEPLOY_KEY` — private SSH key (RSA/ED25519) for `DEPLOY_USER`
- `DEPLOY_PORT` — optional (default 22)
- `TARGET_DIR` — path on the remote host where this repo is cloned

Workflow behavior (template):
- runs on push to `main`
- connects to the remote host using the supplied SSH key
- runs `git fetch && git reset --hard origin/main` inside `TARGET_DIR`
- executes `./day21-bash-python-deploy/deploy.sh` on the remote host to perform the update, optional build, and restart

Notes and prerequisites:
- You must clone this repository on the target host into `TARGET_DIR` and ensure the deploy user has permissions to run the restart command (for example via `sudo` without a password for a specific command).
- The workflow template uses a common community action to perform SSH commands — you'll find the exact file at `.github/workflows/deploy_day21.yml` in this repo. Replace the sample `restart` command and `health` URL with values appropriate to the service you deploy.

Server setup checklist (VPS) — quick steps

1. Create a server (Ubuntu 22.04 / Debian 12 recommended) and add an SSH user (example: `deploy`).

```bash
# on your local machine
ssh-keygen -t ed25519 -C "deploy key for myapp"
ssh-copy-id deploy@your.server.ip
```

2. On the server, clone the repo into the target directory and make the deploy script executable:

```bash
sudo mkdir -p /var/www/30DaysBackendChallenge
sudo chown deploy:deploy /var/www/30DaysBackendChallenge
su - deploy
git clone https://github.com/enyasystem/30DaysBackendChallenge.git /var/www/30DaysBackendChallenge
cd /var/www/30DaysBackendChallenge
chmod +x day21-bash-python-deploy/deploy.sh
```

3. (Optional) Allow the `deploy` user to restart a systemd service without password for the specific command. Edit sudoers with `sudo visudo` and add:

```
deploy ALL=(ALL) NOPASSWD: /bin/systemctl restart myapp.service
```

4. Test manual deploy on the server:

```bash
cd /var/www/30DaysBackendChallenge
./day21-bash-python-deploy/deploy.sh --dir . --branch main --restart-cmd "sudo systemctl restart myapp.service" --health-url "http://localhost:8080/health" --watcher ./day21-bash-python-deploy/watcher.py
```

5. Use the GitHub Actions workflow by adding the repository secrets (DEPLOY_HOST, DEPLOY_USER, DEPLOY_KEY, TARGET_DIR). After that, pushing to `main` will trigger the workflow template included in this repo.

systemd template

You can find an example systemd unit at `day21-bash-python-deploy/systemd/sample-myapp.service`. Customize `WorkingDirectory` and `ExecStart` for your service.

Security notes
- Keep your private keys secure — never commit them to the repo. Use GitHub repository secrets for CI.
- Prefer service-specific sudo permissions over wide NOPASSWD access.


