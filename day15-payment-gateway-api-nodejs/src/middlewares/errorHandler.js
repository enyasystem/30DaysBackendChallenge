const logger = require('../lib/logger');

module.exports = function errorHandler(err, req, res, next){
  logger.error('unhandled_error', { message: err.message, stack: err.stack });
  res.status(500).json({ error: 'internal_error' });
};
