/**
 * Fake slow data source to simulate database latency.
 * getItem returns an object after a short delay.
 */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const FAKE_DATA = {
  '1': { id: '1', name: 'Red Widget', price: 9.99 },
  '2': { id: '2', name: 'Blue Widget', price: 12.49 },
  '3': { id: '3', name: 'Green Widget', price: 7.5 }
};

async function getItem(id) {
  // simulate latency
  await sleep(400);
  return FAKE_DATA[id] || null;
}

module.exports = { getItem };
