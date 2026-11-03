const { describe, test } = require('node:test');
const assert = require('node:assert');

// Test totalAmount calculation logic from order-service
function totalAmount(lines, discountPercent) {
  const subtotal = lines.reduce((s, l) => s + l.unitCents * l.qty, 0);
  return Math.round((subtotal * (100 - discountPercent)) / 100) / 100;
}

function normalizeItems(items) {
  if (!items || items.length === 0) throw new Error('items must not be empty');
  const merged = new Map();
  for (const { pid, qty } of items) {
    if (!Number.isInteger(pid) || pid <= 0) throw new Error('invalid pid');
    if (!Number.isInteger(qty) || qty <= 0) throw new Error('qty must be an integer > 0');
    merged.set(pid, (merged.get(pid) || 0) + qty);
  }
  return [...merged].map(([pid, qty]) => ({ pid, qty }));
}

describe('Order Service Helper Functions', () => {
  test('normalizeItems should merge duplicate product IDs and sum quantities', () => {
    const raw = [
      { pid: 1, qty: 2 },
      { pid: 2, qty: 5 },
      { pid: 1, qty: 3 },
    ];
    const normalized = normalizeItems(raw);
    assert.strictEqual(normalized.length, 2);
    assert.deepStrictEqual(normalized.find(i => i.pid === 1), { pid: 1, qty: 5 });
    assert.deepStrictEqual(normalized.find(i => i.pid === 2), { pid: 2, qty: 5 });
  });

  test('normalizeItems should throw on empty items, negative or non-integer values', () => {
    assert.throws(() => normalizeItems([]), /items must not be empty/);
    assert.throws(() => normalizeItems([{ pid: -1, qty: 1 }]), /invalid pid/);
    assert.throws(() => normalizeItems([{ pid: 1, qty: 0 }]), /qty must be an integer > 0/);
    assert.throws(() => normalizeItems([{ pid: 1, qty: -5 }]), /qty must be an integer > 0/);
  });

  test('totalAmount should correctly calculate with 0% discount', () => {
    const lines = [
      { unitCents: 10000, qty: 2 }, // 2 * $100 = $200
      { unitCents: 5000, qty: 5 },  // 5 * $50 = $250
    ];
    const total = totalAmount(lines, 0);
    assert.strictEqual(total, 450);
  });

  test('totalAmount should correctly calculate with 5% discount (SILVER)', () => {
    const lines = [
      { unitCents: 4000, qty: 1 }, // 1 * $40 = $40
    ];
    const total = totalAmount(lines, 5); // 40 - 2 = 38
    assert.strictEqual(total, 38);
  });

  test('totalAmount should correctly calculate with 10% discount (GOLD)', () => {
    const lines = [
      { unitCents: 4000, qty: 1 }, // 1 * $40 = $40
    ];
    const total = totalAmount(lines, 10); // 40 - 4 = 36
    assert.strictEqual(total, 36);
  });
});

