const express = require('express');
const path = require('path');
const merchantRoutes = require('./routes/merchant');
const providerRoutes = require('./routes/provider');
const webhookRoutes = require('./routes/webhooks');
const app = express();

// JSON middleware for endpoints
app.use(express.json());

// Serve static frontend from /public
app.use(express.static(path.join(__dirname, '..', 'public')));

// mount routers (API)
app.use('/', merchantRoutes);
app.use('/', providerRoutes);
app.use('/', webhookRoutes);

// basic health
app.get('/health', (req,res)=> res.json({ ok:true }));

module.exports = app;
