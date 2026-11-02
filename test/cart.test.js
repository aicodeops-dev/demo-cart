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

// New tests for shipping rule and rounding

test("free shipping for orders >= $50", () => {
  const cart = createCart();
  addItem(cart, { sku: "expensive", name: "Expensive", price: 60 });
  // taxRate 0, no discount → total should be just the subtotal
  assert.equal(total(cart, { taxRate: 0 }), 60);
});

test("shipping charge for orders < $50", () => {
  const cart = createCart();
  addItem(cart, { sku: "cheap", name: "Cheap", price: 20 });
  // subtotal 20, taxRate 0, shipping 5.99 → total 25.99
  assert.equal(total(cart, { taxRate: 0 }), 25.99);
});

test("total is rounded to whole cents", () => {
  const cart = createCart();
  // subtotal 10, taxRate 7.75% → tax = 0.775, taxed = 10.775
  // shipping applies (subtotal < 50) = 5.99, sum = 16.765 → rounded = 16.77
  addItem(cart, { sku: "item", name: "Item", price: 10 });
  assert.equal(total(cart, { taxRate: 0.0775 }), 16.77);
});
