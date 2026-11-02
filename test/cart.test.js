import { test } from "node:test";
import assert from "node:assert/strict";
import { createCart, addItem, removeItem, subtotal, total } from "../src/cart.js";

test("adds items and sums the subtotal", () => {
  const cart = createCart();
  addItem(cart, { sku: "mug", name: "Mug", price: 12, qty: 2 });
  addItem(cart, { sku: "tee", name: "T-shirt", price: 20 });
  assert.equal(subtotal(cart), 44);
});

test("adding the same sku increases the quantity", () => {
  const cart = createCart();
  addItem(cart, { sku: "mug", name: "Mug", price: 12 });
  addItem(cart, { sku: "mug", name: "Mug", price: 12 });
  assert.equal(cart.items.length, 1);
  assert.equal(cart.items[0].qty, 2);
});

test("removes items", () => {
  const cart = createCart();
  addItem(cart, { sku: "mug", name: "Mug", price: 12 });
  removeItem(cart, "mug");
  assert.equal(subtotal(cart), 0);
});

test("applies tax with no discount", () => {
  const cart = createCart();
  addItem(cart, { sku: "tee", name: "T-shirt", price: 100 });
  assert.equal(total(cart, { taxRate: 0.1 }), 110);
});
