const { createPaperAccount, buyAsset, calculatePortfolioValue, deriveProjectedReturn, formatCurrency } = window.MarketTracker;

const initialAssets = [
  {
    symbol: 'AAPL',
    name: 'Apple',
    type: 'Stock',
    price: 196.54,
    change: 1.84,
    projectedMonthly: 12.6,
    sentiment: 'Bullish',
    description: 'Strong cash flow and AI-driven device demand.'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    type: 'Stock',
    price: 430.75,
    change: 0.82,
    projectedMonthly: 10.4,
    sentiment: 'Bullish',
    description: 'Cloud and enterprise software momentum.'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA',
    type: 'Stock',
    price: 126.14,
    change: 2.61,
    projectedMonthly: 16.2,
    sentiment: 'Momentum',
    description: 'AI infrastructure demand remains strong.'
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'Crypto',
    price: 68811.23,
    change: 1.11,
    projectedMonthly: 15.7,
    sentiment: 'Momentum',
    description: 'Institutional interest and ETF rotation.'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'Crypto',
    price: 3467.86,
    change: -0.63,
    projectedMonthly: 11.4,
    sentiment: 'Balanced',
    description: 'Layer-2 growth supports long-term demand.'
  },
  {
    symbol: 'XAU',
    name: 'Gold',
    type: 'Commodity',
    price: 2370.18,
    change: 0.42,
    projectedMonthly: 8.8,
    sentiment: 'Defensive',
    description: 'Classic hedge against volatility.'
  }
];

const state = {
  assets: initialAssets,
  account: loadAccount()
};

const refs = {
  marketGrid: document.getElementById('market-grid'),
  recommendations: document.getElementById('recommendations'),
  strategies: document.getElementById('strategies'),
  portfolioList: document.getElementById('portfolio-list'),
  balance: document.getElementById('balance'),
  buyingPower: document.getElementById('buying-power'),
  portfolioValue: document.getElementById('portfolio-value'),
  pnl: document.getElementById('pnl'),
  target: document.getElementById('target'),
  progressBar: document.getElementById('progress-bar'),
  depositInput: document.getElementById('deposit-input'),
  buyInput: document.getElementById('buy-input'),
  assetSelect: document.getElementById('asset-select')
};

function loadAccount() {
  const fromStorage = window.localStorage.getItem('market-tracker-account');
  if (!fromStorage) {
    return createPaperAccount();
  }

  try {
    const parsed = JSON.parse(fromStorage);
    return {
      balance: Number(parsed.balance || 1000),
      holdings: parsed.holdings || {},
      totalInvested: Number(parsed.totalInvested || 0),
      transactions: parsed.transactions || []
    };
  } catch (error) {
    return createPaperAccount();
  }
}

function saveAccount() {
  window.localStorage.setItem('market-tracker-account', JSON.stringify(state.account));
}

function refreshPrices() {
  state.assets = state.assets.map((asset, index) => ({
    ...asset,
    price: Number((asset.price * (1 + (index % 3 - 1) * 0.004)).toFixed(2)),
    change: Number((asset.change + ((index % 2 === 0 ? 1 : -1) * 0.2)).toFixed(2))
  }));
  render();
}

function depositFunds() {
  const amount = Number(refs.depositInput.value);
  if (Number.isFinite(amount) && amount > 0) {
    state.account.balance = Number((state.account.balance + amount).toFixed(2));
    saveAccount();
    render();
  }
}

function buySelectedAsset() {
  const amount = Number(refs.buyInput.value);
  const selectedSymbol = refs.assetSelect.value;
  const asset = state.assets.find((item) => item.symbol === selectedSymbol);

  if (!asset) {
    return;
  }

  try {
    buyAsset(state.account, asset, amount);
    saveAccount();
    render();
  } catch (error) {
    window.alert(error.message);
  }
}

function renderMetrics() {
  const portfolioValue = calculatePortfolioValue(state.account, state.assets);
  const initialBalance = 1000;
  const pnl = portfolioValue - initialBalance;
  const projectedReturn = deriveProjectedReturn(state.account, state.assets);
  const target = 50;
  const progress = Math.min(100, (projectedReturn / target) * 100);

  refs.balance.textContent = formatCurrency(state.account.balance);
  refs.buyingPower.textContent = formatCurrency(state.account.balance);
  refs.portfolioValue.textContent = formatCurrency(portfolioValue);
  refs.pnl.textContent = `${pnl >= 0 ? '+' : ''}${formatCurrency(pnl)}`;
  refs.target.textContent = `${projectedReturn.toFixed(1)}% / ${target}% target`;
  refs.progressBar.style.width = `${Math.max(8, progress)}%`;
}

function renderMarketCards() {
  refs.marketGrid.innerHTML = state.assets
    .map((asset) => {
      const changeClass = asset.change >= 0 ? 'positive' : 'negative';
      return `
        <article class="asset-card">
          <div class="asset-topline">
            <div>
              <h3>${asset.symbol}</h3>
              <span>${asset.name}</span>
            </div>
            <span class="pill ${changeClass}">${asset.change >= 0 ? '+' : ''}${asset.change.toFixed(2)}%</span>
          </div>
          <p class="asset-price">${formatCurrency(asset.price)}</p>
          <p>${asset.type} • ${asset.sentiment}</p>
          <p class="asset-description">${asset.description}</p>
          <div class="card-actions">
            <button class="btn" data-buy="${asset.symbol}">Buy $100</button>
            <span class="mini">Projected ${asset.projectedMonthly.toFixed(1)}%/mo</span>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderRecommendations() {
  const sorted = [...state.assets].sort((a, b) => b.projectedMonthly - a.projectedMonthly);
  const topThree = sorted.slice(0, 3);
  refs.recommendations.innerHTML = topThree
    .map((asset) => `
      <article class="recommend-card">
        <h3>${asset.symbol}</h3>
        <p>${asset.description}</p>
        <div class="recommend-meta">
          <span>Suggested weight: ${asset.symbol === 'NVDA' ? '30%' : asset.symbol === 'BTC' ? '25%' : '20%'}</span>
          <span>Risk: ${asset.sentiment}</span>
        </div>
      </article>
    `)
    .join('');
}

function renderStrategies() {
  const strategies = [
    {
      title: 'Growth tilt',
      body: 'Favor high-momentum names such as NVDA and BTC while keeping a defensive stake in gold.'
    },
    {
      title: 'Balanced swing',
      body: 'Mix a core of large-cap stocks with one crypto and one commodity for smoother dips.'
    },
    {
      title: 'Monthly challenge',
      body: 'Use 50% monthly target as a simulation benchmark, then rebalance every 7 days.'
    }
  ];

  refs.strategies.innerHTML = strategies
    .map((strategy) => `
      <article class="strategy-card">
        <h3>${strategy.title}</h3>
        <p>${strategy.body}</p>
      </article>
    `)
    .join('');
}

function renderPortfolio() {
  if (Object.keys(state.account.holdings).length === 0) {
    refs.portfolioList.innerHTML = '<p class="empty-state">No trades yet. Start with a small buy to build your paper portfolio.</p>';
    return;
  }

  refs.portfolioList.innerHTML = Object.values(state.account.holdings)
    .map((holding) => {
      const asset = state.assets.find((item) => item.symbol === holding.symbol);
      const currentValue = holding.shares * asset.price;
      return `
        <li class="portfolio-row">
          <div>
            <strong>${holding.symbol}</strong>
            <span>${holding.shares.toFixed(3)} shares</span>
          </div>
          <div>
            <strong>${formatCurrency(currentValue)}</strong>
            <span>Avg cost ${formatCurrency(holding.avgCost)}</span>
          </div>
        </li>
      `;
    })
    .join('');
}

function attachEvents() {
  document.getElementById('deposit-btn').addEventListener('click', depositFunds);
  document.getElementById('buy-btn').addEventListener('click', buySelectedAsset);
  document.getElementById('refresh-btn').addEventListener('click', refreshPrices);
  document.getElementById('market-grid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-buy]');
    if (!button) return;
    const symbol = button.getAttribute('data-buy');
    refs.assetSelect.value = symbol;
    refs.buyInput.value = '100';
    buySelectedAsset();
  });
}

function populateAssetSelector() {
  refs.assetSelect.innerHTML = state.assets
    .map((asset) => `<option value="${asset.symbol}">${asset.symbol} - ${asset.name}</option>`)
    .join('');
}

function render() {
  populateAssetSelector();
  renderMetrics();
  renderMarketCards();
  renderRecommendations();
  renderStrategies();
  renderPortfolio();
}

attachEvents();
render();
