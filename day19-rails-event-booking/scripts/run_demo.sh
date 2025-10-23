#!/usr/bin/env bash
# Lightweight demo runner that starts the app via bundle exec rackup in a subshell
# so it inherits the same Ruby/Bundler environment, runs API requests, prints responses
# and shuts the server down.

set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

PORT=${PORT:-4567}
HOST=127.0.0.1
LOGFILE=server.log

echo "Starting server (foreground subshell) on ${HOST}:${PORT}..."
# Start rackup in background but in same shell session so it uses current bundler
bundle exec rackup -p ${PORT} -o ${HOST} > "${LOGFILE}" 2>&1 &
SERVER_PID=$!
echo "Server PID=${SERVER_PID}"

# wait for server to be ready
for i in {1..20}; do
  if curl -sS "http://${HOST}:${PORT}/health" >/dev/null 2>&1; then
    break
  fi
  sleep 0.2
done

echo "Running demo requests..."

echo "Create event:" 
curl -s -w '\nHTTP_STATUS:%{http_code}\n' -X POST "http://${HOST}:${PORT}/events" -H 'Content-Type: application/json' -d '{"title":"Demo Concert","capacity":2}' || true

echo "List events:"
curl -s -w '\nHTTP_STATUS:%{http_code}\n' "http://${HOST}:${PORT}/events" || true

echo "Book seat:"
curl -s -w '\nHTTP_STATUS:%{http_code}\n' -X POST "http://${HOST}:${PORT}/events/1/book" -H 'Content-Type: application/json' -d '{"name":"Alice"}' || true

echo "Cancel booking:"
curl -s -w '\nHTTP_STATUS:%{http_code}\n' -X DELETE "http://${HOST}:${PORT}/events/1/bookings/1" || true

echo "--- server log ---"
sleep 0.2
tail -n 200 "${LOGFILE}" || true

echo "Stopping server PID ${SERVER_PID}"
kill ${SERVER_PID} || true
sleep 0.2
exit 0
