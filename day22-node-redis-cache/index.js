/**
 * Simple Express app that demonstrates cache-aside using Redis.
 * GET /item/:id  - returns an item (from cache or mock DB)
 * POST /cache/clear - clears cache for an id (body: { id })
 */

require('dotenv').config();
const express = require('express');
const cache = require('./cache');
const db = require('./services/mock_db');

const app = express();
app.use(express.json());

const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS || 60);

// Simple in-memory counters for demonstration / metrics
let metrics = {
  cacheHits: 0,
  cacheMisses: 0,
  cacheClears: 0,
  requests: 0,
  startedAt: Date.now()
};

app.get('/item/:id', async (req, res) => {
  const id = req.params.id;
  try {
    metrics.requests += 1;
    // 1) Try cache
    const cached = await cache.get(id);
    if (cached) {
      metrics.cacheHits += 1;
      console.log('cache HIT for', id);
      return res.json({ source: 'cache', data: JSON.parse(cached) });
    }

    metrics.cacheMisses += 1;
    console.log('cache MISS for', id, '— reading from DB');
    // 2) On miss, read from DB
    const item = await db.getItem(id);
    if (!item) return res.status(404).json({ error: 'not found' });

    // 3) populate cache asynchronously (cache-aside)
    await cache.set(id, JSON.stringify(item), CACHE_TTL_SECONDS);
    return res.json({ source: 'db', data: item });
  } catch (err) {
    console.error('error in /item/:id', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.post('/cache/clear', async (req, res) => {
  const id = req.body && req.body.id;
  if (!id) return res.status(400).json({ error: 'id required' });
  try {
    await cache.del(id);
    metrics.cacheClears += 1;
    return res.json({ ok: true });
  } catch (err) {
    console.error('error clearing cache', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

// Simple metrics endpoint returning JSON (and optional Prometheus-style text)
app.get('/metrics', (req, res) => {
  const accept = req.headers.accept || '';
  if (accept.includes('text/plain')) {
    // prometheus-ish plain text
    const lines = [];
    lines.push(`# HELP cache_hits Number of cache hits`);
    lines.push(`# TYPE cache_hits counter`);
    lines.push(`cache_hits ${metrics.cacheHits}`);
    lines.push(`# HELP cache_misses Number of cache misses`);
    lines.push(`# TYPE cache_misses counter`);
    lines.push(`cache_misses ${metrics.cacheMisses}`);
    lines.push(`# HELP cache_clears Number of manual cache clears`);
    lines.push(`# TYPE cache_clears counter`);
    lines.push(`cache_clears ${metrics.cacheClears}`);
    lines.push(`# HELP requests Total requests handled`);
    lines.push(`# TYPE requests counter`);
    lines.push(`requests ${metrics.requests}`);
    return res.type('text/plain').send(lines.join('\n'));
  }

  const uptime = Math.floor((Date.now() - metrics.startedAt) / 1000);
  return res.json({
    cacheHits: metrics.cacheHits,
    cacheMisses: metrics.cacheMisses,
    cacheClears: metrics.cacheClears,
    requests: metrics.requests,
    uptime_seconds: uptime
  });
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`day22 cache app listening on ${PORT}`));
