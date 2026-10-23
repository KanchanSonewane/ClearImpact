const test = require('node:test');
const assert = require('node:assert/strict');
const chatController = require('../controllers/chatController');

function createResponse() {
  return {
    statusCode: 200,
    payload: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
}

async function invoke(body, overrides = {}) {
  const req = {
    body,
    ip: `test-${Math.random()}-${Date.now()}`,
    socket: { remoteAddress: '127.0.0.1' },
    ...overrides,
  };
  const res = createResponse();
  await chatController.sendMessage(req, res);
  return res;
}

test('rejects an empty message', async () => {
  const response = await invoke({ message: '   ' });
  assert.equal(response.statusCode, 400);
  assert.match(response.payload.message, /enter a message/i);
});

test('rejects a message over the configured limit', async () => {
  const response = await invoke({ message: 'x'.repeat(2001) });
  assert.equal(response.statusCode, 413);
});

test('answers common questions with grounded guidance', async () => {
  const response = await invoke({ message: 'Explain milestones and escrow' });
  assert.equal(response.statusCode, 200);
  assert.ok(response.payload.reply.length > 20);
});

test('responds to greetings', async () => {
  const response = await invoke({ message: 'Hello' });
  assert.equal(response.statusCode, 200);
  assert.ok(response.payload.reply.length > 10);
});
