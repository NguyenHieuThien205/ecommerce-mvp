const { describe, test } = require('node:test');
const assert = require('node:assert');

const STATUSES = ['PENDING', 'SHIPPING', 'DELIVERED', 'CANCELLED'];
const TRANSITIONS = {
  PENDING: ['SHIPPING', 'CANCELLED'],
  SHIPPING: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

function invalidReason(event) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) return 'event is not an object';
  if (!Number.isInteger(event.oid) || event.oid <= 0) return 'missing or invalid oid';
  if (!Number.isInteger(event.uid) || event.uid <= 0) return 'missing or invalid uid';
  return null;
}

describe('Shipment Service Business Rules', () => {
  test('TC-SHP-02: invalidReason detects missing or invalid oid and uid', () => {
    assert.strictEqual(invalidReason(null), 'event is not an object');
    assert.strictEqual(invalidReason([]), 'event is not an object');
    assert.strictEqual(invalidReason({ uid: 1 }), 'missing or invalid oid');
    assert.strictEqual(invalidReason({ oid: 0, uid: 1 }), 'missing or invalid oid');
    assert.strictEqual(invalidReason({ oid: '1001', uid: 1 }), 'missing or invalid oid');
    assert.strictEqual(invalidReason({ oid: 1001 }), 'missing or invalid uid');
    assert.strictEqual(invalidReason({ oid: 1001, uid: -5 }), 'missing or invalid uid');
    assert.strictEqual(invalidReason({ oid: 1001, uid: 1 }), null);
  });

  test('TC-SHP-03: valid state transitions for shipment', () => {
    assert.strictEqual(TRANSITIONS['PENDING'].includes('SHIPPING'), true);
    assert.strictEqual(TRANSITIONS['PENDING'].includes('CANCELLED'), true);
    assert.strictEqual(TRANSITIONS['PENDING'].includes('DELIVERED'), false);

    assert.strictEqual(TRANSITIONS['SHIPPING'].includes('DELIVERED'), true);
    assert.strictEqual(TRANSITIONS['SHIPPING'].includes('PENDING'), false);

    assert.strictEqual(TRANSITIONS['DELIVERED'].length, 0);
    assert.strictEqual(TRANSITIONS['CANCELLED'].length, 0);
  });
});

