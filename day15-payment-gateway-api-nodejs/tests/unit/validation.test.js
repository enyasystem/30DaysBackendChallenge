const request = require('supertest');
const app = require('../../src/app');

describe('input validation', ()=>{
  test('rejects non-numeric amount', async ()=>{
    process.env.API_KEY = 'dev-key-123';
    const res = await request(app).post('/payment-intents').set('x-api-key','dev-key-123').send({ amount: 'abc', currency: 'USD' });
    expect(res.status).toBe(400);
  });
  test('rejects missing currency', async ()=>{
    process.env.API_KEY = 'dev-key-123';
    const res = await request(app).post('/payment-intents').set('x-api-key','dev-key-123').send({ amount: 100 });
    expect(res.status).toBe(400);
  });
});
