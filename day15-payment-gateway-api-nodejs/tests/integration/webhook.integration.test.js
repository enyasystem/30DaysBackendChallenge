const request = require('supertest');
const app = require('../../src/app');
const { sign } = require('../../src/lib/signature');
const store = require('../../src/data/inMemoryStore');

describe('webhook flow', () => {
  beforeAll(()=>{
    // generate ephemeral secrets for tests to avoid hardcoding
    const { randomBytes } = require('crypto');
    process.env.WEBHOOK_SECRET = randomBytes(16).toString('hex');
    process.env.API_KEY = 'test-' + randomBytes(8).toString('hex');
  });

  test('provider posts signed webhook -> merchant verifies and updates intent', async () => {
    // create intent (with API key)
  const createRes = await request(app).post('/payment-intents').set('x-api-key',process.env.API_KEY).send({ amount: 500, currency: 'USD' });
    expect(createRes.status).toBe(201);
    const id = createRes.body.id;

    // simulate provider sending signed webhook directly to merchant
    const event = { id: 'evt_test', type: 'payment_succeeded', data: { paymentIntentId: id } };
    const payload = JSON.stringify(event);
    const signature = sign(payload, process.env.WEBHOOK_SECRET);

    const whRes = await request(app).post('/webhooks/receive').set('x-signature', signature).send(event);
    expect(whRes.status).toBe(200);

    const intent = store.getIntent(id);
    expect(intent.status).toBe('succeeded');
  });
});
