const paymentIntents = new Map();
const processedEventIds = new Set();

module.exports = {
  createIntent(intent) { paymentIntents.set(intent.id, intent); return intent; },
  getIntent(id) { return paymentIntents.get(id); },
  updateIntent(id, patch) {
    const cur = paymentIntents.get(id); if (!cur) return null;
    const updated = {...cur, ...patch, updatedAt: new Date().toISOString()};
    paymentIntents.set(id, updated);
    return updated;
  },
  listIntents() { return Array.from(paymentIntents.values()); },
  markEventProcessed(eventId) { processedEventIds.add(eventId); },
  isEventProcessed(eventId) { return processedEventIds.has(eventId); }
};
