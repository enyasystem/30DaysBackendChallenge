const axios = require('axios');
const { sign } = require('../lib/signature');
const store = require('../data/inMemoryStore');

async function chargeAndSendWebhook({paymentIntentId, webhookUrl, webhookSecret, succeed=true}){
  // simulate processing delay
  await new Promise(r => setTimeout(r, 200));
  const event = {
    id: 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2,8),
    type: succeed ? 'payment_succeeded' : 'payment_failed',
    data: { paymentIntentId },
    createdAt: new Date().toISOString()
  };
  const payload = JSON.stringify(event);
  const signature = sign(payload, webhookSecret);
  try {
    await axios.post(webhookUrl, payload, {
      headers: { 'Content-Type':'application/json', 'x-signature': signature }
    });
    // mark event as sent in provider store (optional)
    store.markEventProcessed(event.id);
    return { ok: true, event };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
module.exports = { chargeAndSendWebhook };
