const express = require('express');
const router = express.Router();
const providerService = require('../services/providerService');
const paymentService = require('../services/paymentService');

router.post('/provider/charge', express.json(), async (req, res) => {
  const { paymentIntentId, webhookUrl, succeed = true } = req.body || {};
  if (!paymentIntentId || !webhookUrl) return res.status(400).json({ error: 'paymentIntentId and webhookUrl required' });

  // mark as processing
  paymentService.setStatus(paymentIntentId, 'processing');

  // simulate provider charging and sending webhook
  const result = await providerService.chargeAndSendWebhook({ paymentIntentId, webhookUrl, webhookSecret: process.env.WEBHOOK_SECRET, succeed });
  if (!result.ok) return res.status(500).json({ error: result.error });
  res.json({ ok: true, event: result.event });
});

module.exports = router;
