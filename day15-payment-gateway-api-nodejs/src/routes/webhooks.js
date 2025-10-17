const express = require('express');
const router = express.Router();
const { verify } = require('../lib/signature');
const paymentService = require('../services/paymentService');
const store = require('../data/inMemoryStore');

router.post('/webhooks/receive', express.json({ type: '*/*' }), (req, res) => {
  const raw = JSON.stringify(req.body || {});
  const signature = req.headers['x-signature'];
  const secret = process.env.WEBHOOK_SECRET;
  if (!verify(raw, secret, signature)) return res.status(401).json({ error: 'invalid signature' });

  const event = req.body;
  if (store.isEventProcessed(event.id)) {
    return res.status(200).json({ ok: true, note: 'event already processed' });
  }

  // simple handler
  const pid = event.data && event.data.paymentIntentId;
  if (event.type === 'payment_succeeded') {
    paymentService.setStatus(pid, 'succeeded');
  } else if (event.type === 'payment_failed') {
    paymentService.setStatus(pid, 'failed');
  }

  store.markEventProcessed(event.id);
  res.status(200).json({ ok: true });
});

module.exports = router;
