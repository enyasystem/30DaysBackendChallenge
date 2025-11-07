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

app.get('/item/:id', async (req, res) => {
  const id = req.params.id;
  try {
    // 1) Try cache
    const cached = await cache.get(id);
    if (cached) {
      console.log('cache HIT for', id);
      return res.json({ source: 'cache', data: JSON.parse(cached) });
    }

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
    return res.json({ ok: true });
  } catch (err) {
    console.error('error clearing cache', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`day22 cache app listening on ${PORT}`));
