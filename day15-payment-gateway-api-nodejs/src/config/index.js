require('dotenv').config();
module.exports = {
  PORT: process.env.PORT || 3000,
  PROVIDER_PORT: process.env.PROVIDER_PORT || 3001,
  // Do not provide production secrets as defaults. Expect these to be set via environment.
  API_KEY: process.env.API_KEY,
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development'
};
