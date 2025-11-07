#!/usr/bin/env bash
# Simple demonstration script that shows cache miss then hit
set -euo pipefail

BASE_URL=${BASE_URL:-http://127.0.0.1:3000}
ID=${1:-1}

has_jq=0
if command -v jq >/dev/null 2>&1; then
	has_jq=1
fi

pretty() {
	if [ "$has_jq" -eq 1 ]; then
		jq .
	else
		# fallback: pretty-ish using python if available, else raw
		if command -v python3 >/dev/null 2>&1; then
			python3 -c "import sys, json; print(json.dumps(json.load(sys.stdin), indent=2))"
		else
			cat
		fi
	fi
}

echo "Ensure the app is running and Redis is available: $BASE_URL"
echo
echo "First request (expected cache MISS, slower):"
time curl -sS "$BASE_URL/item/$ID" | pretty
echo
echo "Second request (expected cache HIT, faster):"
time curl -sS "$BASE_URL/item/$ID" | pretty

echo
echo "Clearing cache for id=$ID"
curl -sS -X POST -H 'Content-Type: application/json' -d "{ \"id\": \"$ID\" }" "$BASE_URL/cache/clear" | pretty
echo
echo "Third request after clear (expected MISS again):"
time curl -sS "$BASE_URL/item/$ID" | pretty
