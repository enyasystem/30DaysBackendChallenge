const config = require('../config');

module.exports = function apiKeyAuth(req, res, next){
  const key = req.headers['x-api-key'];
  if (!key || key !== config.API_KEY) return res.status(401).json({ error: 'unauthorized' });
  next();
};
