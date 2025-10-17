const crypto = require('crypto');
function sign(payload, secret) {
  const h = crypto.createHmac('sha256', secret);
  h.update(typeof payload === 'string' ? payload : JSON.stringify(payload));
  return h.digest('hex');
}
function verify(payload, secret, signature) {
  if (!signature) return false;
  const expected = sign(payload, secret);
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch (e) {
    return false;
  }
}
module.exports = { sign, verify };
