require('dotenv').config();
module.exports = {
  PORT: process.env.PORT || 3000,
  PROVIDER_PORT: process.env.PROVIDER_PORT || 3001,
  API_KEY: process.env.API_KEY || 'dev-key-123',
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || 'whsec_dev_secret',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
