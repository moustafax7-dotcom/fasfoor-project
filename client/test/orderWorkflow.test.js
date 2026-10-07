import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getNextOrderAction } from '../src/services/orderWorkflow.js';

test('ready pickup orders complete at the branch while delivery orders go to the courier', () => {
  assert.equal(getNextOrderAction({ status: 'ready', deliveryType: 'pickup' }).next, 'delivered');
  assert.equal(getNextOrderAction({ status: 'ready', deliveryType: 'delivery' }).next, 'out_for_delivery');
  for (const status of ['delivered', 'cancelled']) assert.equal(getNextOrderAction({ status, deliveryType: 'pickup' }), undefined);
});
