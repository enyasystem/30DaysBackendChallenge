# Day 15 — Payment Gateway Simulation API (Node.js)

Project name: Payment Gateway Simulation | Node.js | API with Webhook Handling

This folder contains a learning-focused guide to build a Payment Gateway Simulation API using Node.js and Express. The goal is to teach you how to design, scaffold, document, test, and iterate on a backend project focused on payment flows and webhook handling. You'll implement a simulated payment provider, a merchant-facing API, and webhook endpoints that the provider calls to notify about payment events.

## Learning objectives

- Design a payment-focused REST API with a clear contract and event (webhook) handling.
- Scaffold a Node.js project using best practices (config, env, logging, tests).
- Implement a simulated payment provider and merchant webhook receiver.
- Write unit and integration tests (jest + supertest) and run them locally.
- Prepare the project for CI (lint + tests) and local webhook testing.


---

## Project contract — Payment Gateway Simulation

- Purpose: Simulate a payment gateway and a merchant API to learn request flows, webhook signing/verification, retries and idempotency.
- Key resources and data shapes:
  - PaymentIntent: { id: string, amount: number, currency: string, status: 'created'|'processing'|'succeeded'|'failed', metadata?: object, createdAt: ISODate }
  - WebhookEvent: { id: string, type: string, data: object, createdAt: ISODate }

- Core endpoints (merchant-facing):
  - POST /payment-intents — create a payment intent (body: {amount, currency, metadata})
  - GET /payment-intents/:id — fetch payment status
  - POST /webhooks/receive — merchant endpoint that receives provider webhooks (for local testing)

- Simulated provider endpoints (internal to the simulation):
  - POST /provider/charge — simulate charging a PaymentIntent; provider will respond and then POST a webhook to the merchant's webhook endpoint

- Webhook details:
  - Webhook payloads include an `event` type (e.g., payment_succeeded, payment_failed).
  - Webhooks should be signed (HMAC SHA256) with a shared secret; the receiver verifies the signature before acting.

- Auth: Keep the merchant API simple (API key via header) for this learning phase. Webhook verification uses HMAC signature.
- Data store: Start with an in-memory store for PaymentIntents. Optionally add SQLite later.


---

## Project structure (Node.js / Express)

- day15-guided-api/
  - README.md (this file)
  - package.json
  - .env.example
  - .gitignore
  - src/
    - index.js           # server entry (reads config, starts app)
    - app.js             # express app factory — mounts routes and middleware
    - config/
      - index.js         # centralize env reads and defaults
    - routes/
      - merchant.js      # merchant-facing routes (/payment-intents)
      - provider.js      # simulation provider routes (/provider/*)
      - webhooks.js      # webhook receiver (merchant)
    - controllers/
      - paymentController.js
      - providerController.js
      - webhookController.js
    - services/
      - paymentService.js  # business logic, idempotency, status transitions
      - providerService.js # simulates provider processing and webhook dispatch
    - lib/
      - signature.js       # HMAC signing / verification helpers
      - logger.js          # structured logger (console)
    - middlewares/
      - errorHandler.js
      - requestLogger.js
      - apiKeyAuth.js      # simple API key auth for merchant endpoints
    - data/
      - inMemoryStore.js   # simple persistence for learning
    - tests/
      - unit/
      - integration/

Why: Separation of concerns helps tests, keeps controllers thin, and makes it easy to swap the storage layer later.


---

> Note: This README now focuses on the Node.js implementation. If you later want a Flask equivalent, I can create it.


---

## Start guide — Node.js (Payment Gateway Simulation)

1) Prerequisites
- Node.js 18+ and npm or pnpm installed
- (Optional) nvm for Node version management

2) Scaffold (commands)

Run these in the project root (`day15-payment-gateway-api-nodejs`):

```bash
npm init -y
npm install express dotenv axios
npm install --save-dev nodemon jest supertest eslint
```

3) Minimal package.json scripts to add:

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest --runInBand",
    "lint": "eslint . --ext .js"
  }
}
```

4) Minimal files to create (learning-first):
- `src/index.js` — reads config and starts the HTTP server
- `src/app.js` — express app factory; mounts routes and middlewares
- `src/config/index.js` — load .env and defaults
- `src/routes/merchant.js` — `POST /payment-intents`, `GET /payment-intents/:id`
- `src/routes/provider.js` — `POST /provider/charge` (simulates provider)
- `src/routes/webhooks.js` — `POST /webhooks/receive` (merchant webhook receiver)
- `src/controllers/*` — thin controllers that call services
- `src/services/paymentService.js` — in-memory PaymentIntent store and logic
- `src/services/providerService.js` — simulates provider events and sends webhooks
- `src/lib/signature.js` — HMAC sign/verify helpers
- `src/data/inMemoryStore.js` — small persistence for learning
- `.env.example` — show PORT, API_KEY, WEBHOOK_SECRET
- `tests/*` — unit and integration tests

5) Run locally
- Start in dev:

```bash
npm run dev
```

- Run tests:

```bash
npm test
```

6) Local webhook testing tips
- Since the provider simulation will POST to a merchant webhook URL, you can run both the provider and merchant endpoints locally on different ports and use `ngrok` (or a local request forwarder) to test webhook delivery from outside. For pure local simulation, the provider service can be configured to call `http://localhost:PORT/webhooks/receive` directly.

---

## Tests and quality gates

- Unit tests: test service functions (create intent, status transitions, idempotency), signature helpers.
- Integration tests: API endpoints using jest + supertest. Include tests that verify webhook verification and that the provider calls the webhook endpoint.
- Linting: ESLint for JS with a basic config.
- CI: GitHub Actions to run `npm ci`, `npm run lint`, and `npm test` on push/pull requests.

Example test ideas:
- Create PaymentIntent with valid data -> 201 with intent id
- Create PaymentIntent with invalid amount -> 400
- Provider charges an intent -> provider triggers webhook -> merchant receives and verifies signature -> status flips to `succeeded` or `failed`
- Webhook with bad signature -> rejected (401)
- Re-delivered webhook with same event id -> idempotent handling (no duplicate state change)

---

## Best practices and tips

- Use an app factory (`createApp`) for easier testing.
- Keep controllers thin; put business rules in services.
- Centralize config and secrets in `src/config/index.js` and provide `.env.example`.
- Use HMAC signature verification for webhooks. Log failures and return proper HTTP codes so providers can retry.
- Implement idempotency keys for webhook processing (store processed event ids).
- Keep tests fast and deterministic: mock external HTTP calls (e.g., provider sending webhooks) in unit tests and use real HTTP in a small number of integration tests.

---

## Exercises (payment-focused)

1) Implement merchant endpoints and in-memory PaymentIntent store.
2) Implement provider simulation that accepts a charge request and asynchronously sends a signed webhook event to the merchant webhook endpoint.
3) Add HMAC signature generation and verification in `src/lib/signature.js`.
4) Add idempotency for webhook events (store processed event IDs in the in-memory store).
5) Persist the store to SQLite and add migration notes.
6) Add API key auth for merchant endpoints and show how to rotate keys.
7) Add tests for signature verification, webhook handling, and idempotency.

---

## Next steps and offer

If you want, I can scaffold the full minimal Node.js starter (JavaScript) with:

- A working `src` with controllers, services, signature helper, and in-memory store.
- Jest + Supertest integration tests for the core happy paths and webhook handling.
- `package.json` scripts and `.env.example`.

Tell me: do you want me to scaffold the Node.js starter now? If yes, I will mark the scaffold todo as in-progress and create the files and run tests.