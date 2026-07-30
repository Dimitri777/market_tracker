(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.MarketTracker = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const DEFAULT_BALANCE = 1000;

  function createPaperAccount(initialBalance = DEFAULT_BALANCE) {
    return {
      balance: Number(initialBalance.toFixed(2)),
      holdings: {},
      totalInvested: 0,
      transactions: []
    };
  }

  function buyAsset(account, asset, amountUsd) {
    if (!account || !asset) {
      throw new Error('Account and asset are required.');
    }

    const amount = Number(amountUsd);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Amount must be greater than zero.');
    }

    if (amount > account.balance) {
      throw new Error('Not enough balance.');
    }

    const price = Number(asset.price);
    const shares = amount / price;

    account.balance = Number((account.balance - amount).toFixed(2));
    account.totalInvested = Number((account.totalInvested + amount).toFixed(2));

    if (!account.holdings[asset.symbol]) {
      account.holdings[asset.symbol] = {
        symbol: asset.symbol,
        shares: 0,
        avgCost: 0
      };
    }

    const holding = account.holdings[asset.symbol];
    const newTotalCost = Number((holding.avgCost * holding.shares + amount).toFixed(2));
    holding.shares = Number((holding.shares + shares).toFixed(6));
    holding.avgCost = holding.shares > 0 ? Number((newTotalCost / holding.shares).toFixed(2)) : 0;

    account.transactions.push({
      symbol: asset.symbol,
      shares: Number(shares.toFixed(6)),
      amountUsd: Number(amount.toFixed(2)),
      price: Number(price.toFixed(2))
    });

    return account;
  }

  function calculatePortfolioValue(account, assets) {
    const assetMap = new Map(assets.map((asset) => [asset.symbol, asset]));
    let totalValue = Number(account.balance.toFixed(2));

    Object.values(account.holdings).forEach((holding) => {
      const asset = assetMap.get(holding.symbol);
      if (asset) {
        totalValue += holding.shares * Number(asset.price);
      }
    });

    return Number(totalValue.toFixed(2));
  }

  function deriveProjectedReturn(account, assets) {
    const totalValue = calculatePortfolioValue(account, assets);
    let projectedGain = 0;

    Object.values(account.holdings).forEach((holding) => {
      const asset = assets.find((item) => item.symbol === holding.symbol);
      if (asset) {
        projectedGain += holding.shares * Number(asset.price) * (Number(asset.projectedMonthly) / 100);
      }
    });

    const percentage = totalValue > 0 ? (projectedGain / totalValue) * 100 : 0;
    return Number(Math.max(percentage, 0).toFixed(2));
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  }

  return {
    createPaperAccount,
    buyAsset,
    calculatePortfolioValue,
    deriveProjectedReturn,
    formatCurrency,
    DEFAULT_BALANCE
  };
});
