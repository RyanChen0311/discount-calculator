# 折扣計算器 — Discount Calculator

> A browser-based discount and profit calculator with **buyer view** (bulk discount pricing) and **seller view** (profit margin analysis) — no dependencies, no build step.

---

## Live Demo

👉 https://ryanchen0311.github.io/discount_per/

---

## Features

- **Bulk discount rule** — set a trigger quantity and discount percentage
- **Buyer view** — calculates original total, discount amount, and final price
- **Seller view** — calculates total cost, revenue, profit amount, and margin
- **Profit warning** — alerts when profit margin falls below the configured minimum (default 20%)
- **Input validation** — all numeric fields clamped to valid ranges on every keystroke

---

## Discount Logic

```
completeGroups = floor(quantity ÷ discountQty)
discountAmount = price × discountQty × (discountPercent ÷ 100) × completeGroups
remainingItems = quantity mod discountQty   ← charged at full price
finalPrice     = originalTotal − discountAmount
```

Example: price = $10, quantity = 7, rule = buy 3 → 20% off

```
completeGroups = floor(7 / 3) = 2
discountAmount = $10 × 3 × 0.20 × 2 = $12.00
remainingItems = 7 mod 3 = 1  (charged at full price)
finalPrice     = $70.00 − $12.00 = $58.00
```

---

## Profit Calculation

```
totalCost    = costPrice × quantity
totalRevenue = sellingPrice × quantity − discountAmount
profitAmount = totalRevenue − totalCost
profitMargin = profitAmount ÷ totalCost × 100%
```

A green indicator appears when `profitMargin ≥ minProfit`, red when below.

---

## Project Structure

```
discount_per/
├── index.html   # HTML layout — buyer and seller sections
├── styles.css   # Card layout, result rows, warning/success states
└── script.js    # Discount logic, profit calculation, input validation
```

---

## Running Locally

```bash
npx serve .
# open http://localhost:3000
```

---

## License

MIT — see [LICENSE](LICENSE).
