# Day 22 — Node + Redis Cache

Objective
Build a small Node.js service that demonstrates a cache-aside pattern using Redis. The goal is to learn how and why to cache, how to implement a cache lookup/update flow, and which edge-cases to consider.

What you'll find here
- `index.js` — Express HTTP server exposing endpoints to fetch items and clear cache.
- `cache.js` — small Redis wrapper used by the app.
- `services/mock_db.js` — a fake slow data source (simulates a database with delay).
- `package.json` — dependencies and npm scripts.
- `docker-compose.yml` — quick way to run Redis locally for testing.
- `test/curl_test.sh` — simple script to demonstrate cache hits and misses.

Learning objectives (what you'll learn)
- Cache-aside pattern (read-through): check cache, on miss read from DB, populate cache
- TTLs: why we set expiry for cached entries
- Cache invalidation: simple strategies (manual clear, TTL)
- Observability: logging cache hits/misses and status

Quick start (using Docker Compose)

Prerequisites: Docker & Docker Compose, Node.js 16+

Run Redis and the service:

```bash
docker compose up -d
npm install
npm start
```

Demo (in another terminal):

```bash
bash test/curl_test.sh
```

If you don't want Docker, install Redis locally and ensure `REDIS_URL` in `.env.example` matches your server.

Key design notes (short)
- The app uses a cache-aside approach: it only stores items into Redis after a DB read on a cache miss.
- TTL is set to avoid stale caches piling up; for critical data consider cache invalidation on writes.
- For production: add metrics, circuit breakers for Redis failures, and a Redis client pool.

Exercises for learning
1. Change TTL and observe cache hit durations with the test script.
2. Simulate Redis down (stop container) and see how the app behaves — add graceful fallback if desired.
3. Implement write-through caching (write to DB and cache together) and compare pros/cons.

License: same as repo
