const test = require('node:test');
const assert = require('node:assert/strict');
const { createPaperAccount, buyAsset, calculatePortfolioValue, deriveProjectedReturn } = require('../portfolio');

test('buyAsset updates balance and holdings', () => {
  const account = createPaperAccount(1000);
  const asset = { symbol: 'AAPL', price: 100, projectedMonthly: 10 };
  buyAsset(account, asset, 100);

  assert.equal(account.balance, 900);
  assert.equal(account.holdings.AAPL.shares, 1);
  assert.equal(account.holdings.AAPL.avgCost, 100);
});

test('portfolio value and return projection are computed', () => {
  const account = createPaperAccount(1000);
  const asset = { symbol: 'AAPL', price: 100, projectedMonthly: 10 };
  buyAsset(account, asset, 200);
  const portfolioValue = calculatePortfolioValue(account, [{ symbol: 'AAPL', price: 120, projectedMonthly: 10 }]);
  const projection = deriveProjectedReturn(account, [{ symbol: 'AAPL', price: 120, projectedMonthly: 10 }]);

  assert.equal(portfolioValue, 1000 + 20 * 2);
  assert.equal(projection, 2.31);
});
