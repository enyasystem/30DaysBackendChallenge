const request = require('supertest');
const app = require('../../src/app');

describe('input validation', ()=>{
  test('rejects non-numeric amount', async ()=>{
    const { randomBytes } = require('crypto');
    process.env.API_KEY = 'test-' + randomBytes(8).toString('hex');
    const res = await request(app).post('/payment-intents').set('x-api-key', process.env.API_KEY).send({ amount: 'abc', currency: 'USD' });
    expect(res.status).toBe(400);
  });
  test('rejects missing currency', async ()=>{
    const { randomBytes } = require('crypto');
    process.env.API_KEY = 'test-' + randomBytes(8).toString('hex');
    const res = await request(app).post('/payment-intents').set('x-api-key', process.env.API_KEY).send({ amount: 100 });
    expect(res.status).toBe(400);
  });
});
