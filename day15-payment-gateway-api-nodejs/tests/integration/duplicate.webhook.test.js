const request = require('supertest');
const app = require('../../src/app');
const { sign } = require('../../src/lib/signature');
const store = require('../../src/data/inMemoryStore');

describe('duplicate webhook handling', ()=>{
  beforeAll(()=> process.env.WEBHOOK_SECRET = 'whsec_dev_secret');

  test('processing same event twice only changes state once', async ()=>{
    const createRes = await request(app).post('/payment-intents').set('x-api-key','dev-key-123').send({ amount: 500, currency: 'USD' });
    const id = createRes.body.id;

    const event = { id: 'evt_dup', type: 'payment_succeeded', data: { paymentIntentId: id } };
    const payload = JSON.stringify(event);
    const signature = sign(payload, process.env.WEBHOOK_SECRET);

    const r1 = await request(app).post('/webhooks/receive').set('x-signature', signature).send(event);
    expect(r1.status).toBe(200);
    const intent1 = store.getIntent(id);
    expect(intent1.status).toBe('succeeded');

    const r2 = await request(app).post('/webhooks/receive').set('x-signature', signature).send(event);
    expect(r2.status).toBe(200);
    const intent2 = store.getIntent(id);
    expect(intent2.status).toBe('succeeded');
  });
});
