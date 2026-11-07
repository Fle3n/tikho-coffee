import test from 'node:test';
import assert from 'node:assert/strict';
import { products, priceFor, recommendDrink } from '../public/assets/data.js';

test('custom options change only customizable drink prices', () => {
  assert.equal(priceFor(products.find(p => p.id === 'capp'), '350', 'oat'), 330);
  assert.equal(priceFor(products.find(p => p.id === 'lemon'), '350', 'oat'), 270);
  assert.equal(priceFor(products.find(p => p.id === 'crois'), '350', 'oat'), 190);
});

test('milk-free recommendations never require milk', () => {
  for (const kind of ['coffee', 'no-coffee', 'fresh']) {
    for (const flavor of ['soft', 'strong', 'sweet', 'bright']) {
      const result = recommendDrink({ kind, flavor, milk: 'none' });
      assert.ok(['filter', 'lemon'].includes(result.id));
      assert.equal(result.milk, 'none');
    }
  }
});

test('budget limits include plant milk surcharge', () => {
  for (const budget of [0, 150, 190, 240, 270, 300, 350]) {
    for (const kind of ['coffee', 'no-coffee', 'fresh']) {
      const result = recommendDrink({ kind, milk: 'oat', budget });
      if (result) assert.ok(result.total <= budget);
    }
  }
  assert.equal(recommendDrink({ budget: 100 }), null);
});

test('no-coffee recommendations stay in the non-coffee menu even on a budget', () => {
  for (const budget of [190, 250, 300, 350]) {
    const result = recommendDrink({ kind: 'no-coffee', budget });
    if (result) assert.equal(result.category, 'special');
  }
});
