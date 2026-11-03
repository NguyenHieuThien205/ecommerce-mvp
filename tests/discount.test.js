const { describe, test } = require('node:test');
const assert = require('node:assert');
const { discountForScore } = require('../services/order-service/src/discount');

describe('TC-ORD-04: Discount calculation by membership score', () => {
  test('Score 0 (BRONZE) should receive 0% discount', () => {
    assert.strictEqual(discountForScore(0), 0);
  });

  test('Score 50 (below SILVER) should receive 0% discount', () => {
    assert.strictEqual(discountForScore(50), 0);
  });

  test('Score 99 (boundary below SILVER) should receive 0% discount', () => {
    assert.strictEqual(discountForScore(99), 0);
  });

  test('Score 100 (SILVER) should receive 5% discount', () => {
    assert.strictEqual(discountForScore(100), 5);
  });

  test('Score 250 (above SILVER, below GOLD) should receive 5% discount', () => {
    assert.strictEqual(discountForScore(250), 5);
  });

  test('Score 499 (boundary below GOLD) should receive 5% discount', () => {
    assert.strictEqual(discountForScore(499), 5);
  });

  test('Score 500 (GOLD) should receive 10% discount', () => {
    assert.strictEqual(discountForScore(500), 10);
  });

  test('Score 1500 (VIP above GOLD) should receive 10% discount', () => {
    assert.strictEqual(discountForScore(1500), 10);
  });

  test('Edge cases: null, undefined, negative, string numbers', () => {
    assert.strictEqual(discountForScore(null), 0);
    assert.strictEqual(discountForScore(undefined), 0);
    assert.strictEqual(discountForScore(-10), 0);
    assert.strictEqual(discountForScore('100'), 5);
    assert.strictEqual(discountForScore('500'), 10);
  });
});
