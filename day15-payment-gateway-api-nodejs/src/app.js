const express = require('express');
const merchantRoutes = require('./routes/merchant');
const providerRoutes = require('./routes/provider');
const webhookRoutes = require('./routes/webhooks');
const app = express();

// JSON middleware for merchant endpoints
app.use(express.json());

// mount routers
app.use('/', merchantRoutes);
app.use('/', providerRoutes);
app.use('/', webhookRoutes);

// basic health
app.get('/health', (req,res)=> res.json({ ok:true }));

module.exports = app;
