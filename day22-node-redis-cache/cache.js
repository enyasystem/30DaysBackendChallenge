/**
 * Minimal Redis wrapper using node-redis v4. Exposes get/set/del.
 * Keeps the usage tiny for learning purposes.
 */
const { createClient } = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const client = createClient({ url: REDIS_URL });
let ready = false;

client.on('error', (err) => {
  console.error('Redis client error', err);
});

async function ensureConnected() {
  if (!ready) {
    await client.connect();
    ready = true;
  }
}

async function get(key) {
  try {
    await ensureConnected();
    return await client.get(key);
  } catch (err) {
    console.error('cache get error', err);
    return null;
  }
}

async function set(key, value, ttlSeconds) {
  try {
    await ensureConnected();
    if (ttlSeconds) {
      return await client.setEx(key, ttlSeconds, value);
    } else {
      return await client.set(key, value);
    }
  } catch (err) {
    console.error('cache set error', err);
    return null;
  }
}

async function del(key) {
  try {
    await ensureConnected();
    return await client.del(key);
  } catch (err) {
    console.error('cache del error', err);
    return null;
  }
}

module.exports = { get, set, del };
