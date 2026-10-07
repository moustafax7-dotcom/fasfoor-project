const { test } = require('node:test');
const assert = require('node:assert/strict');
const { generateOtp, sendOtp, isOtpDeliveryAvailable } = require('../src/services/otpService');

test('production OTP refuses simulated delivery and never logs verification codes', async (t) => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  t.after(() => { if (previous === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous; });
  const log = t.mock.method(console, 'log', () => {});
  assert.equal(isOtpDeliveryAvailable(), false);
  await assert.rejects(sendOtp('01000000000', '123456'), { status: 503 });
  assert.equal(log.mock.callCount(), 0);
  for (let i = 0; i < 100; i++) assert.match(generateOtp(), /^[1-9][0-9]{5}$/);
});
