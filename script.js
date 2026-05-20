/**
 * script.js — Discount Calculator
 *
 * Two calculation modes
 * --------------------
 * 1. Buyer view  — calculateDiscount()
 *    Given a unit price, quantity, and a bulk-discount rule (buy N → get X% off),
 *    computes how many complete discount groups apply and the final price.
 *
 * 2. Seller view — calculateSellerProfit()
 *    Given cost price and the selling scenario above, computes total cost,
 *    total revenue (after discounts), profit amount, and profit margin.
 *    Warns if the margin falls below the configured minimum (default 20%).
 *
 * Discount logic
 * --------------
 * Discount applies per complete group of N items:
 *   completeGroups = floor(quantity / discountQty)
 *   discountAmount = price × discountQty × (discountPercent / 100) × completeGroups
 *   remainingItems = quantity % discountQty   ← charged at full price
 *
 * Input validation
 * ----------------
 * All numeric inputs are clamped to their valid ranges on every keystroke.
 */

'use strict';

// ── Formatting ───────────────────────────────────────────────────────────────

/**
 * Format a number as a currency string (e.g. 12.5 → "$12.50").
 * @param {number} amount
 * @returns {string}
 */
function formatCurrency(amount) {
  return '$' + amount.toFixed(2);
}

// ── Input validation ─────────────────────────────────────────────────────────

/**
 * Clamp an input element's numeric value to [min, max].
 * @param {HTMLInputElement} input
 * @param {number} min
 * @param {number} max
 */
function clampInput(input, min, max) {
  const value = parseFloat(input.value);
  if (!isNaN(value)) {
    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }
}

// ── Buyer: discount calculation ──────────────────────────────────────────────

function calculateDiscount() {
  const price          = parseFloat(document.getElementById('price').value)          || 0;
  const quantity       = parseInt(document.getElementById('quantity').value)         || 0;
  const discountQty    = parseInt(document.getElementById('discountQty').value)      || 0;
  const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;

  const originalTotal = price * quantity;
  let discountAmount  = 0;

  if (discountQty > 0 && quantity >= discountQty) {
    const completeGroups = Math.floor(quantity / discountQty);
    discountAmount = price * discountQty * (discountPercent / 100) * completeGroups;
  }

  const finalPrice = originalTotal - discountAmount;

  document.getElementById('originalTotal').textContent  = formatCurrency(originalTotal);
  document.getElementById('discountAmount').textContent = formatCurrency(discountAmount);
  document.getElementById('finalPrice').textContent     = formatCurrency(finalPrice);

  // Status message
  const discountInfo = document.getElementById('discountInfo');
  if (discountQty > 0 && quantity >= discountQty) {
    const completeGroups  = Math.floor(quantity / discountQty);
    const remainingItems  = quantity % discountQty;
    const remainingNote   = remainingItems > 0
      ? `，剩餘 ${remainingItems} 件未達折扣標準`
      : '';
    discountInfo.textContent = `已應用折扣：${completeGroups} 組完整折扣（每組 ${discountQty} 件 ${discountPercent}% 折扣）${remainingNote}`;
    discountInfo.style.color = '#4CAF50';
  } else {
    discountInfo.textContent = '未應用折扣 — 數量未達折扣標準';
    discountInfo.style.color = '#666';
  }

  // Sync seller view if cost is already filled in
  if (document.getElementById('costPrice').value) {
    calculateSellerProfit();
  }
}

// ── Seller: profit calculation ───────────────────────────────────────────────

function calculateSellerProfit() {
  const costPrice      = parseFloat(document.getElementById('costPrice').value)       || 0;
  const quantity       = parseInt(document.getElementById('quantity').value)          || 0;
  const minProfit      = parseFloat(document.getElementById('minProfit').value)       || 20;
  const sellingPrice   = parseFloat(document.getElementById('price').value)           || 0;
  const discountQty    = parseInt(document.getElementById('discountQty').value)       || 0;
  const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;

  const totalCost    = costPrice * quantity;
  let   totalRevenue = sellingPrice * quantity;

  // Mirror the buyer-side discount logic
  if (discountQty > 0 && quantity >= discountQty) {
    const completeGroups = Math.floor(quantity / discountQty);
    const discountAmount = sellingPrice * discountQty * (discountPercent / 100) * completeGroups;
    totalRevenue -= discountAmount;
  }

  const profitAmount = totalRevenue - totalCost;
  const profitMargin = totalCost > 0 ? (profitAmount / totalCost) * 100 : 0;

  document.getElementById('totalCost').textContent    = formatCurrency(totalCost);
  document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
  document.getElementById('profitAmount').textContent = formatCurrency(profitAmount);
  document.getElementById('profitMargin').textContent = profitMargin.toFixed(2) + '%';

  const profitInfo = document.getElementById('profitInfo');
  if (profitMargin >= minProfit) {
    profitInfo.textContent = `利潤率良好（${profitMargin.toFixed(2)}% ≥ ${minProfit}%）`;
    profitInfo.className   = 'profit-info success';
  } else {
    profitInfo.textContent = `警告：利潤率（${profitMargin.toFixed(2)}%）低於最低要求（${minProfit}%）`;
    profitInfo.className   = 'profit-info warning';
  }
}

// ── Input validation listeners ───────────────────────────────────────────────

const VALIDATION_RULES = {
  discountQty:     [1,   999999],
  discountPercent: [0,   100],
  price:           [0,   999999],
  costPrice:       [0,   999999],
  quantity:        [1,   999999],
  minProfit:       [20,  100],
};

document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('input', () => {
    const rule = VALIDATION_RULES[input.id];
    if (rule) clampInput(input, rule[0], rule[1]);
  });
});