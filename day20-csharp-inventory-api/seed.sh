#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
BASE_URL=${1:-http://localhost:5000}

# simple sample items
items=(
  '{"name":"Widget A","quantity":10,"description":"Basic widget"}'
  '{"name":"Widget B","quantity":5,"description":"Premium widget"}'
  '{"name":"Gadget","quantity":25,"description":"Handy gadget"}'
)

for payload in "${items[@]}"; do
  echo "Posting: $payload"
  curl -s -X POST "$BASE_URL/api/items" -H "Content-Type: application/json" -d "$payload" || true
done

echo "Done."
