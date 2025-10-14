#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="${1:-./recordings_video}"
shift || true

if [ $# -eq 0 ]; then
  echo "usage: $0 [outdir] -- <command...>"
  echo "example: $0 ./recordings_video -- cargo run -- get github"
  exit 1
fi

# split on --
ARGS=("$@")
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
TS=$(date +%Y%m%d-%H%M%S)
CAST="$OUT_DIR/session-$TS.cast"
GIF="$OUT_DIR/session-$TS.gif"
MP4="$OUT_DIR/session-$TS.mp4"

# Build a raw command string (unescaped) joining args with spaces
CMD_RAW=$(printf '%s ' "${CMD_ARGS[@]}")
CMD_RAW=${CMD_RAW% } # trim trailing space

if ! command -v asciinema >/dev/null 2>&1; then
  echo "asciinema is not installed. Install it with (Ubuntu):"
  echo "  sudo apt install asciinema"
  echo "or via snap: sudo snap install asciinema"
  exit 2
fi

# Record using asciinema. -c runs the command and exits when it finishes.
# Use the raw command string directly to avoid bash -lc option parsing issues.
echo "Recording terminal session to $CAST"
asciinema rec -c "$CMD_RAW" "$CAST"

# Try to convert to GIF if asciicast2gif (python) is available
if command -v asciicast2gif >/dev/null 2>&1; then
  echo "Converting cast to GIF -> $GIF"
  asciicast2gif "$CAST" "$GIF"
  if command -v ffmpeg >/dev/null 2>&1; then
    echo "Converting GIF to MP4 -> $MP4"
    ffmpeg -y -i "$GIF" -movflags +faststart -pix_fmt yuv420p "$MP4"
  fi
  echo "Saved: $GIF ${MP4:+and $MP4}"
else
  echo "asciicast2gif not found. To create a GIF or MP4, install one of the following tools:
  - asciicast2gif (pip): pip install asciicast2gif
  - svg-term + rsvg-convert + ffmpeg workflow

You still have the raw asciinema cast file: $CAST
You can upload the cast to https://asciinema.org/ or convert locally once you install asciicast2gif or ffmpeg tools."
fi

echo "Done."
