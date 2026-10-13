const assert = require('node:assert/strict');
const { test } = require('node:test');
const { HealthController } = require('../dist/health.controller');

test('health endpoint reports the service as healthy', () => {
  assert.deepEqual(new HealthController().getHealth(), { status: 'ok' });
});