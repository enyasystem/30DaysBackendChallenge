const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');

router.post('/payment-intents', (req, res) => {
  const { amount, currency, metadata } = req.body || {};
  if (!amount || !currency) return res.status(400).json({ error: 'amount and currency required' });
  const intent = paymentService.createPaymentIntent({ amount, currency, metadata });
  res.status(201).json(intent);
});

router.get('/payment-intents/:id', (req, res) => {
  const intent = paymentService.getIntent(req.params.id);
  if (!intent) return res.status(404).json({ error: 'not found' });
  res.json(intent);
});

module.exports = router;
