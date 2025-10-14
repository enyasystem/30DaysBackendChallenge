#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="${1:-./recordings}"
shift || true

# Collect remaining args and split on -- if present
ARGS=("$@")
if [ ${#ARGS[@]} -eq 0 ]; then
  echo "usage: $0 [outdir] -- <command...>"
  echo "example: $0 ./recordings -- cargo run -- get github"
  exit 1
fi

# find '--' separator
SEPARATOR_INDEX=-1
for i in "${!ARGS[@]}"; do
  if [ "${ARGS[$i]}" = "--" ]; then
    SEPARATOR_INDEX=$i
    break
  fi
done

if [ $SEPARATOR_INDEX -ge 0 ]; then
  CMD_ARGS=("${ARGS[@]:$((SEPARATOR_INDEX+1))}")
else
  CMD_ARGS=("${ARGS[@]}")
fi

if [ ${#CMD_ARGS[@]} -eq 0 ]; then
  echo "No command provided after --"
  exit 1
fi

mkdir -p "$OUT_DIR"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG="$OUT_DIR/recording-$TIMESTAMP.log"
TTYFILE="$OUT_DIR/recording-$TIMESTAMP.typescript"

# Prepare a safely escaped command string
CMD_STR=$(printf '%q ' "${CMD_ARGS[@]}")

if command -v script >/dev/null 2>&1; then
  echo "Recording full terminal session to $TTYFILE"
  # Use bash -lc with the safely escaped command string
  script -q "$TTYFILE" -c "bash -lc $CMD_STR"
  # also save a plaintext copy if possible
  cp "$TTYFILE" "$LOG" || true
else
  echo "'script' not found; falling back to capturing stdout/stderr to $LOG"
  if command -v stdbuf >/dev/null 2>&1; then
    stdbuf -oL -eL bash -lc "$CMD_STR" 2>&1 | tee "$LOG"
  else
    bash -lc "$CMD_STR" 2>&1 | tee "$LOG"
  fi
fi

echo "Saved log: $LOG"
[ -f "$TTYFILE" ] && echo "Saved typescript: $TTYFILE"
