#!/usr/bin/env bash
# Simple deploy script
# Usage: deploy.sh [--dir DIR] [--branch BRANCH] [--pre-cmd 'cmd'] [--build-cmd 'cmd'] [--restart-cmd 'cmd'] [--health-url URL] [--watcher PATH] [--dry-run] [--force]

set -euo pipefail

DIR="$(pwd)"
BRANCH="main"
PRE_CMD=""
BUILD_CMD=""
RESTART_CMD=""
HEALTH_URL=""
WATCHER=""
DRY_RUN=0
FORCE=0
LOGFILE="deploy.log"

usage() {
  cat <<EOF
Usage: $0 [options]
Options:
  --dir PATH         Target repo directory (default: current dir)
  --branch NAME      Branch to update (default: main)
  --pre-cmd CMD      Command to run before pulling (quoted)
  --build-cmd CMD    Build command to run after pull (quoted)
  --restart-cmd CMD  Command to restart the service (quoted)
  --health-url URL   Health check URL to verify with watcher
  --watcher PATH     Path to watcher.py (optional)
  --dry-run          Print actions but don't run them
  --force            Force overwrite local changes
  -h, --help         Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir) DIR="$2"; shift 2;;
    --branch) BRANCH="$2"; shift 2;;
    --pre-cmd) PRE_CMD="$2"; shift 2;;
    --build-cmd) BUILD_CMD="$2"; shift 2;;
    --restart-cmd) RESTART_CMD="$2"; shift 2;;
    --health-url) HEALTH_URL="$2"; shift 2;;
    --watcher) WATCHER="$2"; shift 2;;
    --dry-run) DRY_RUN=1; shift;;
    --force) FORCE=1; shift;;
    -h|--help) usage; exit 0;;
    *) echo "Unknown arg: $1"; usage; exit 2;;
  esac
done

log() {
  ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  echo "[$ts] $*" | tee -a "$DIR/$LOGFILE"
}

run_or_echo() {
  if [ "$DRY_RUN" -eq 1 ]; then
    echo "DRY-RUN: $*"
  else
    # Use bash -lc to safely run the assembled command string; avoids unsafe eval use
    bash -lc "$*"
  fi
}

if [ "$DRY_RUN" -eq 1 ]; then
  echo "Running in dry-run mode"
fi

log "Starting deploy: dir=$DIR branch=$BRANCH"

if [ ! -d "$DIR/.git" ]; then
  log "ERROR: $DIR does not look like a git repository"
  echo "ERROR: target directory is not a git repo: $DIR"
  exit 2
fi

pushd "$DIR" >/dev/null

# check working tree
if [ "$FORCE" -ne 1 ]; then
  if [ -n "$(git status --porcelain)" ]; then
    log "Aborting: working tree has local changes (use --force to override)"
    echo "Working tree has local changes. Commit or stash them, or use --force." >&2
    popd >/dev/null
    exit 3
  fi
fi

log "Fetching latest from remote"
run_or_echo git fetch --all --prune

log "Checking out branch $BRANCH"
run_or_echo git checkout "$BRANCH"

# reset to remote branch to avoid merge conflicts in automated deploys
log "Resetting to origin/$BRANCH"
run_or_echo git reset --hard "origin/$BRANCH"

if [ -n "$PRE_CMD" ]; then
  log "Running pre-cmd: $PRE_CMD"
  run_or_echo "$PRE_CMD"
fi

log "Updating working tree (pull)
"
run_or_echo git pull --ff-only || true

if [ -n "$BUILD_CMD" ]; then
  log "Running build command: $BUILD_CMD"
  run_or_echo "$BUILD_CMD"
fi

if [ -n "$RESTART_CMD" ]; then
  log "Restarting using: $RESTART_CMD"
  run_or_echo "$RESTART_CMD"
fi

if [ -n "$HEALTH_URL" ] && [ -n "$WATCHER" ]; then
  log "Invoking watcher: $WATCHER --health-url '$HEALTH_URL' --restart-cmd '$RESTART_CMD'"
  if [ "$DRY_RUN" -eq 1 ]; then
    echo "DRY-RUN: would run watcher: $WATCHER --health-url '$HEALTH_URL' --restart-cmd '$RESTART_CMD'"
  else
    python3 "$WATCHER" --health-url "$HEALTH_URL" --restart-cmd "$RESTART_CMD"
  fi
fi

log "Deploy complete"

popd >/dev/null

exit 0
