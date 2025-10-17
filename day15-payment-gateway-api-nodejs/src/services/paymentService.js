const store = require('../data/inMemoryStore');
const { randomUUID } = require('crypto');

function createPaymentIntent({amount,currency,metadata={}}){
  const id = 'pi_' + randomUUID();
  const intent = { id, amount, currency, status: 'created', metadata, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  return store.createIntent(intent);
}
function getIntent(id){ return store.getIntent(id); }
function setStatus(id, status){
  return store.updateIntent(id, { status });
}
module.exports = { createPaymentIntent, getIntent, setStatus, _store: store };
