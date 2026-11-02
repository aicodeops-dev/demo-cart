// A tiny shopping cart used in AI CodeOps tutorials.
// Prices are in dollars.

export function createCart() {
  return { items: [] };
}

export function addItem(cart, { sku, name, price, qty = 1 }) {
  if (!sku) throw new Error("sku is required");
  if (price < 0) throw new Error("price must not be negative");
  const existing = cart.items.find((i) => i.sku === sku);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({ sku, name, price, qty });
  }
  return cart;
}

export function removeItem(cart, sku) {
  cart.items = cart.items.filter((i) => i.sku !== sku);
  return cart;
}

export function subtotal(cart) {
  return cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function applyDiscount(amount, percent) {
  return amount - amount * (percent / 100);
}

/** Round a numeric amount to two decimal places (whole cents). */
function roundToCents(amount) {
  return Math.round(amount * 100) / 100;
}

/** Free‑shipping threshold – orders with subtotal ≥ $50 ship free. */
const FREE_SHIPPING_THRESHOLD = 50; // dollars

/** Flat shipping fee applied when the threshold is not met. */
const SHIPPING_COST = 5.99; // dollars

export function total(cart, { taxRate = 0.0825, discountPercent = 0 } = {}) {
  // Base subtotal before any discounts
  const base = subtotal(cart);
  // Apply discount if any
  const discounted = applyDiscount(base, discountPercent);
  // Apply tax on discounted amount
  const taxed = discounted + discounted * taxRate;
  // Determine shipping: only charge if there is a positive subtotal less than threshold
  const shipping = base > 0 && base < FREE_SHIPPING_THRESHOLD ? SHIPPING_COST : 0;
  // Return final amount rounded to whole cents
  return roundToCents(taxed + shipping);
}
