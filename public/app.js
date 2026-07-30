// App state and data
const appState = {
  currentPage: 'dashboard',
  watchlist: JSON.parse(localStorage.getItem('tradescope-watchlist')) || ['ETH', 'BTC', 'AAPL'],
  portfolio: JSON.parse(localStorage.getItem('tradescope-portfolio')) || {
    cash: 4425.55,
    positions: [{ symbol: 'BNB', qty: 1.00008, entryPrice: 574.45, currentPrice: 574.36 }],
    totalDeposited: 5000
  },
  trades: JSON.parse(localStorage.getItem('tradescope-trades')) || []
};

// Market data (simulated)
const marketData = {
  META: { name: 'Meta Platforms', category: 'STOCK', price: 614.98, change: 2.84, volume: '45M' },
  AAPL: { name: 'Apple Inc.', category: 'STOCK', price: 232.61, change: 2.47, volume: '50M' },
  NFLX: { name: 'Netflix Inc.', category: 'STOCK', price: 1012.37, change: 1.24, volume: '35M' },
  AMZN: { name: 'Amazon.com Inc.', category: 'STOCK', price: 228.62, change: 0.72, volume: '60M' },
  BNB: { name: 'BNB', category: 'CRYPTO', price: 574.36, change: -0.002, volume: '1.2B' },
  ETH: { name: 'Ethereum', category: 'CRYPTO', price: 1962.44, change: -0.66, volume: '45B' },
  BTC: { name: 'Bitcoin', category: 'CRYPTO', price: 45234.56, change: 1.23, volume: '32B' },
  MATIC: { name: 'MATIC (migrated to POL)', category: 'CRYPTO', price: 0.126, change: -18.66, volume: '800M' },
  MSFT: { name: 'Microsoft Corp.', category: 'STOCK', price: 428.47, change: -3.71, volume: '55M' },
  JPM: { name: 'JPMorgan Chase', category: 'STOCK', price: 261.8, change: -3.04, volume: '28M' },
  NVDA: { name: 'NVIDIA Corp.', category: 'STOCK', price: 132.67, change: -1.72, volume: '75M' }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  renderPage('dashboard');
});

// Navigation
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      renderPage(page);
    });
  });
}

// Page rendering
function renderPage(page) {
  appState.currentPage = page;
  const content = document.getElementById('content-area');

  switch (page) {
    case 'dashboard':
      content.innerHTML = renderDashboard();
      break;
    case 'watchlist':
      content.innerHTML = renderWatchlist();
      attachWatchlistEvents();
      break;
    case 'portfolio':
      content.innerHTML = renderPortfolio();
      attachPortfolioEvents();
      break;
    case 'signals':
      content.innerHTML = renderSignals();
      break;
    case 'strategies':
      content.innerHTML = renderStrategies();
      break;
    case 'paper':
      content.innerHTML = renderPaperTrading();
      attachPaperTradingEvents();
      break;
  }
}

// ========== DASHBOARD PAGE ==========
function renderDashboard() {
  return `
    <div class="page-header">
      <h1>Market Overview</h1>
      <p>Live market intelligence and trading signals</p>
    </div>

    <div class="grid grid-4">
      <div class="card">
        <div class="metric-label"><i class="fas fa-coins"></i> Total Crypto Market Cap</div>
        <div class="metric-value">$1 764 003 104 492B</div>
      </div>
      <div class="card">
        <div class="metric-label"><i class="fas fa-bitcoin"></i> BTC Dominance</div>
        <div class="metric-value">72.70%</div>
      </div>
      <div class="card">
        <div class="metric-label"><i class="fas fa-arrows-alt"></i> 24h Volume</div>
        <div class="metric-value">$43 236 211 449B</div>
      </div>
      <div class="card">
        <div class="metric-label"><i class="fas fa-thermometer-half"></i> Fear & Greed Index</div>
        <div class="metric-value" style="color: #00bcd4;">91</div>
        <div class="metric-change">Extreme Greed</div>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <div class="card-header">
          <div class="card-title-icon">
            <i class="fas fa-arrow-up"></i>
            Top Gainers
          </div>
        </div>
        ${renderAssetList(['META', 'AAPL', 'NFLX', 'AMZN', 'BNB'], true)}
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title-icon">
            <i class="fas fa-arrow-down" style="color: #ff6b6b;"></i>
            Top Losers
          </div>
        </div>
        ${renderAssetList(['MATIC', 'MSFT', 'JPM', 'NVDA'], false)}
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <div class="card-header">
          <h2>Watchlist Preview</h2>
          <a class="view-all">View All</a>
        </div>
        ${renderWatchlistPreview()}
      </div>
      <div class="card">
        <div class="card-header">
          <h2>Quick Signals</h2>
          <a class="view-all">View All</a>
        </div>
        ${renderQuickSignals()}
      </div>
    </div>
  `;
}

function renderAssetList(symbols, isGainers) {
  return symbols.map(symbol => {
    const data = marketData[symbol];
    const changeClass = data.change >= 0 ? 'change-positive' : 'change-negative';
    const changeSign = data.change >= 0 ? '+' : '';
    return `
      <div class="asset-row">
        <div class="asset-info">
          <div class="asset-name">${symbol}</div>
          <div class="asset-description">${data.name}</div>
        </div>
        <div class="asset-price">
          <div class="price">$${data.price.toFixed(2)}</div>
          <div class="change ${changeClass}">${changeSign}${data.change.toFixed(2)}%</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderWatchlistPreview() {
  return `
    <div class="asset-row">
      <div class="asset-info">
        <div class="asset-name">ETH</div>
        <div class="asset-description">Ethereum</div>
      </div>
      <div class="asset-price">
        <div class="price">$1 962.44</div>
        <div class="change change-negative">-0.66%</div>
      </div>
    </div>
  `;
}

function renderQuickSignals() {
  return `
    <div class="list-item">
      <div>
        <strong>BTC</strong>
        <div style="font-size: 12px; color: #8892a6; margin-top: 4px;">Holding major support with declining bearish volume. Positive trend intact.</div>
      </div>
    </div>
  `;
}

// ========== WATCHLIST PAGE ==========
function renderWatchlist() {
  const watchlistItems = appState.watchlist.map(symbol => marketData[symbol]).filter(Boolean);
  
  return `
    <div class="page-header">
      <h1>Watchlist</h1>
      <p>Track your favorite assets in real-time</p>
    </div>

    <div class="header-actions">
      <button class="btn btn-icon" id="add-asset-btn" style="width: auto; padding: 10px 20px;">
        <i class="fas fa-plus"></i> Add Asset
      </button>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>Tracked Assets</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>24h Change</th>
            <th>Volume</th>
            <th>Market Cap</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${appState.watchlist.map(symbol => {
            const data = marketData[symbol];
            if (!data) return '';
            const changeClass = data.change >= 0 ? 'change-positive' : 'change-negative';
            const changeSign = data.change >= 0 ? '+' : '';
            return `
              <tr>
                <td><strong>${symbol}</strong></td>
                <td>${data.name}</td>
                <td>$${data.price.toFixed(2)}</td>
                <td><span class="${changeClass}">${changeSign}${data.change.toFixed(2)}%</span></td>
                <td>${data.volume}</td>
                <td>$229 591 774 191</td>
                <td><button class="btn btn-small btn-secondary" data-remove="${symbol}">Remove</button></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function attachWatchlistEvents() {
  document.getElementById('add-asset-btn').addEventListener('click', () => {
    const symbol = prompt('Enter symbol (e.g., BTC, ETH, AAPL):').toUpperCase();
    if (symbol && marketData[symbol] && !appState.watchlist.includes(symbol)) {
      appState.watchlist.push(symbol);
      localStorage.setItem('tradescope-watchlist', JSON.stringify(appState.watchlist));
      renderPage('watchlist');
    }
  });

  document.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const symbol = e.target.dataset.remove;
      appState.watchlist = appState.watchlist.filter(s => s !== symbol);
      localStorage.setItem('tradescope-watchlist', JSON.stringify(appState.watchlist));
      renderPage('watchlist');
    });
  });
}

// ========== PORTFOLIO PAGE ==========
function renderPortfolio() {
  const positions = appState.portfolio.positions;
  const totalValue = appState.portfolio.cash + positions.reduce((sum, p) => sum + (p.qty * p.currentPrice), 0);
  const totalInvested = appState.portfolio.totalDeposited - appState.portfolio.cash;
  const totalPnL = totalValue - appState.portfolio.totalDeposited;
  const pnlPercent = ((totalPnL / appState.portfolio.totalDeposited) * 100).toFixed(2);

  return `
    <div class="page-header">
      <h1>Portfolio</h1>
      <p>Monitor your holdings and performance</p>
    </div>

    <div class="header-actions">
      <button class="btn btn-icon" style="width: auto; padding: 10px 20px;">
        <i class="fas fa-plus"></i> Add Holding
      </button>
    </div>

    <div class="grid grid-4">
      <div class="card">
        <div class="metric-label"><i class="fas fa-money-bill"></i> Total Invested</div>
        <div class="metric-value">$${totalInvested.toFixed(2)}</div>
      </div>
      <div class="card">
        <div class="metric-label"><i class="fas fa-chart-line"></i> Current Value</div>
        <div class="metric-value">$${totalValue.toFixed(2)}</div>
      </div>
      <div class="card">
        <div class="metric-label"><i class="fas fa-percent"></i> Total P&L</div>
        <div class="metric-value ${totalPnL >= 0 ? 'change-positive' : 'change-negative'}">
          $${totalPnL.toFixed(2)}
        </div>
        <div class="metric-change ${totalPnL >= 0 ? 'change-positive' : 'change-negative'}">
          ${totalPnL >= 0 ? '+' : ''}${pnlPercent}%
        </div>
      </div>
      <div class="card">
        <div class="metric-label"><i class="fas fa-box"></i> Holdings</div>
        <div class="metric-value">${positions.length}</div>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <div class="card-header">
          <h2>Allocation by Type</h2>
        </div>
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fas fa-chart-pie"></i></div>
          <p>No data available</p>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h2>Performance Summary</h2>
        </div>
        <div style="padding: 20px 0;">
          <div style="background: rgba(76, 175, 80, 0.1); border-left: 3px solid #4caf50; padding: 16px; border-radius: 6px; margin-bottom: 12px;">
            <div style="font-size: 12px; color: #8892a6;">Top Performer</div>
            <div style="font-size: 16px; font-weight: 700; margin-top: 4px;">N/A</div>
          </div>
          <div style="background: rgba(255, 107, 107, 0.1); border-left: 3px solid #ff6b6b; padding: 16px; border-radius: 6px;">
            <div style="font-size: 12px; color: #8892a6;">Worst Performer</div>
            <div style="font-size: 16px; font-weight: 700; margin-top: 4px;">N/A</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>Holdings</h2>
      </div>
      ${positions.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fas fa-inbox"></i></div>
          <p>No holdings yet</p>
          <p style="font-size: 12px; margin-top: 8px;">Add your first holding to start tracking your portfolio</p>
        </div>
      ` : `
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Quantity</th>
              <th>Entry Price</th>
              <th>Current Price</th>
              <th>Value</th>
              <th>P&L</th>
            </tr>
          </thead>
          <tbody>
            ${positions.map(p => {
              const value = p.qty * p.currentPrice;
              const pnl = (p.currentPrice - p.entryPrice) * p.qty;
              const pnlPercent = ((pnl / (p.entryPrice * p.qty)) * 100).toFixed(2);
              return `
                <tr>
                  <td><strong>${p.symbol}</strong></td>
                  <td>${p.qty.toFixed(6)}</td>
                  <td>$${p.entryPrice.toFixed(2)}</td>
                  <td>$${p.currentPrice.toFixed(2)}</td>
                  <td>$${value.toFixed(2)}</td>
                  <td><span class="${pnl >= 0 ? 'change-positive' : 'change-negative'}">
                    ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)} (${pnl >= 0 ? '+' : ''}${pnlPercent}%)
                  </span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

function attachPortfolioEvents() {
  // Portfolio events here
}

// ========== SIGNALS PAGE ==========
function renderSignals() {
  const signals = [
    {
      symbol: 'DOGE',
      name: 'Dogecoin',
      type: 'CRYPTO',
      signalType: 'STRONG BUY',
      strength: 47,
      description: 'Bullish divergence on MACD with strong institutional accumulation patterns.',
      date: '30/07/2026, 10:49:43'
    },
    {
      symbol: 'DOT',
      name: 'Polkadot',
      type: 'CRYPTO',
      signalType: 'STRONG BUY',
      strength: 54,
      description: 'Price consolidating above 200-day MA with decreasing sell-side volume.',
      date: '30/07/2026, 10:49:43'
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      type: 'CRYPTO',
      signalType: 'BUY',
      strength: 41,
      description: 'Holding major support with declining bearish volume. Positive trend intact.',
      date: '30/07/2026, 10:49:43'
    },
    {
      symbol: 'AVAX',
      name: 'Avalanche',
      type: 'CRYPTO',
      signalType: 'SELL',
      strength: 83,
      description: 'Resistance rejection with volume confirmation. Short-term pullback expected.',
      date: '30/07/2026, 10:49:43'
    }
  ];

  return `
    <div class="page-header">
      <h1>Market Signals</h1>
      <p>AI-powered trading recommendations and market insights</p>
    </div>

    <div style="display: flex; gap: 12px; margin-bottom: 20px;">
      <span class="badge badge-crypto" style="background: #4caf50;">STRONG BUY (2 signals)</span>
      <span class="badge badge-crypto" style="background: #00bcd4;">BUY (4 signals)</span>
    </div>

    ${signals.map(signal => {
      const signalColor = signal.signalType === 'STRONG BUY' ? '#4caf50' : signal.signalType === 'BUY' ? '#00bcd4' : '#ff6b6b';
      return `
        <div class="signal-item">
          <div class="signal-header">
            <div>
              <div class="signal-name">${signal.symbol}</div>
              <div class="signal-strength">
                <span class="badge badge-crypto">${signal.type}</span>
                <span style="color: ${signalColor}; font-weight: 700;">Strength ${signal.strength}/100</span>
              </div>
            </div>
          </div>
          <div class="strength-bar">
            <div class="strength-fill" style="width: ${signal.strength}%; background: ${signalColor};"></div>
          </div>
          <div class="signal-description">${signal.description}</div>
          <div style="font-size: 11px; color: #546e7a; margin-top: 12px;">${signal.date}</div>
        </div>
      `;
    }).join('')}
  `;
}

// ========== STRATEGIES PAGE ==========
function renderStrategies() {
  const strategies = [
    {
      title: 'Buy and Hold (HODL)',
      description: 'Purchase assets and hold them for the long term regardless of short-term market fluctuations. The most proven wealth-building strategy over multi-year periods.',
      risk: 'MEDIUM',
      timeHorizon: '3-10+ years',
      expectedReturn: '8-15% per year (historical average)',
      suitableFor: 'Long-term investors who can ignore volatility',
      steps: [
        'Research fundamentally strong assets (BTC, ETH, S&P 500 index funds)',
        'Allocate capital you can afford to leave untouched',
        'Set up automatic recurring purchases (DCA) monthly',
        'Ignore daily price movements — check quarterly',
        'Rebalance once per year to maintain target allocation'
      ],
      pros: ['Time-tested strategy', 'Minimal active management required', 'Avoids emotional selling', 'Tax efficient (fewer capital gains events)'],
      cons: ['Requires patience', 'Full exposure to downturns', 'May underperform active strategies in bull runs']
    },
    {
      title: 'Dollar-Cost Averaging (DCA)',
      description: 'Invest a fixed dollar amount at regular intervals regardless of price. Reduces the impact of volatility by averaging your entry price over time.',
      risk: 'LOW',
      timeHorizon: '1-5+ years',
      expectedReturn: 'Matches market returns over time',
      suitableFor: 'Beginners and salaried investors building wealth over time',
      steps: [
        'Choose 2-3 high-conviction assets',
        'Decide a fixed weekly or monthly amount you can invest',
        'Set up automatic recurring purchases',
        'Do NOT increase buys in dips or decrease in rallies',
        'Hold and reassess allocation annually'
      ],
      pros: ['Eliminates timing risk', 'Builds discipline', 'Works with any budget', 'Reduces emotional decision-making'],
      cons: ['Underperforms lump-sum in pure bull markets', 'Requires consistent cash flow', 'Misses single large accumulation point']
    },
    {
      title: 'Momentum Trading',
      description: 'Buy assets that are trending upward and sell when momentum fades. Uses technical analysis and price action to identify entry and exit points.',
      risk: 'HIGH',
      timeHorizon: 'Days to weeks',
      expectedReturn: '20-50% in bull markets, significant losses in bear markets',
      suitableFor: 'Experienced traders with time to monitor markets daily',
      steps: [
        'Identify assets with strong 30-day and 90-day price momentum',
        'Confirm with volume — rising price on rising volume is bullish',
        'Enter on pullbacks to 20-day moving average',
        'Set stop-loss at 5-8% below entry',
        'Take partial profits at 15-20% gain, trail stop-loss up'
      ],
      pros: ['Can capture large gains in bull markets', 'Clear entry/exit rules', 'Works across all asset classes'],
      cons: ['High transaction costs', 'Requires constant monitoring', 'Significant losses in choppy markets']
    },
    {
      title: 'Value Investing',
      description: 'Buy undervalued assets trading below their intrinsic value. Focus on fundamentals: earnings, revenue growth, competitive moat, and balance sheet strength.',
      risk: 'MEDIUM',
      timeHorizon: '2-5 years',
      expectedReturn: '10-20% per year when done correctly',
      suitableFor: 'Patient investors with strong analytical skills',
      steps: [
        'Screen for stocks with P/E ratio below sector average',
        'Analyze balance sheet: debt-to-equity, cash flow, margins',
        'Identify the catalysts that will unlock value',
        'Build position slowly over 3-6 months',
        'Exit when price reaches fair value or fundamentals deteriorate'
      ],
      pros: ['Built on fundamentals, not speculation', 'Limited downside if research is solid', 'Warren Buffett approach'],
      cons: ['Value traps exist', 'Can underperform for years before thesis plays out', 'Requires deep research skills']
    },
    {
      title: 'Portfolio Diversification',
      description: 'Spread investments across uncorrelated asset classes to reduce risk while maintaining return potential. The only "free lunch" in investing.',
      risk: 'LOW',
      timeHorizon: '5+ years',
      expectedReturn: '7-12% per year depending on allocation',
      suitableFor: 'Conservative to moderate investors seeking steady growth',
      steps: [
        'Allocate 40-60% to equities (mix of US, international, growth, value)',
        '10-20% to crypto (BTC 70%, ETH 20%, alcoins 10%)',
        '10-20% to bonds or stablecoins as ballast',
        '5-10% to commodities (gold oil ETFs)',
        'Rebalance quarterly back to target allocation'
      ],
      pros: ['Reduces single-asset risk', 'Smoother ride through market cycles', 'Proven over decades'],
      cons: ['Limits maximum upside', 'Requires understanding of multiple markets', 'More complex to manage']
    },
    {
      title: 'Breakout Trading',
      description: 'Enter positions when price breaks above key resistance levels with increased volume, signaling a new trend. High risk, high reward in the short term.',
      risk: 'VERY HIGH',
      timeHorizon: 'Hours to days',
      expectedReturn: '30-100% per trade (winners), -10-20% per trade (losers)',
      suitableFor: 'Active traders with strict risk management discipline',
      steps: [
        'Identify consolidation patterns (flags, triangles, bases)',
        'Wait for price to break above resistance on 2x average volume',
        'Enter within 1-3% of the breakout level',
        'Hard stop-loss at the base of the consolidation',
        'Target 2:1 or 3:1 reward/risk ratio',
        'Sell into strength if target is hit'
      ],
      pros: ['Explosive gain potential', 'Clear entry/exit levels', 'Works in all markets'],
      cons: ['High failure rate (50-60% breakouts fail)', 'Requires constant attention', 'Slippage and fees reduce profitability']
    }
  ];

  return `
    <div class="page-header">
      <h1>Investment Strategies</h1>
      <p>Proven strategies tailored to different risk profiles and goals</p>
    </div>

    ${strategies.map(strategy => `
      <div class="strategy-card">
        <div class="strategy-header">
          <div class="strategy-title">${strategy.title}</div>
          <div class="badge" style="background: ${
            strategy.risk === 'LOW' ? '#10b981' :
            strategy.risk === 'MEDIUM' ? '#f59e0b' :
            strategy.risk === 'HIGH' ? '#ef4444' : '#7c3aed'
          };">${strategy.risk}</div>
        </div>
        <div class="strategy-description">${strategy.description}</div>
        
        <div class="strategy-grid">
          <div class="strategy-item">
            <div class="strategy-item-label">Time Horizon</div>
            <div class="strategy-item-value">${strategy.timeHorizon}</div>
          </div>
          <div class="strategy-item">
            <div class="strategy-item-label">Expected Return</div>
            <div class="strategy-item-value">${strategy.expectedReturn}</div>
          </div>
        </div>

        <div>
          <div class="strategy-item-label">Suitable For</div>
          <div style="font-size: 13px; color: #e4e6eb; margin-top: 8px;">${strategy.suitableFor}</div>
        </div>

        <div class="implementation-steps">
          <div class="strategy-item-label" style="margin-top: 20px; margin-bottom: 12px;">Implementation Steps</div>
          ${strategy.steps.map((step, i) => `
            <div class="impl-step">
              <span class="step-number">${i + 1}</span>
              <span>${step}</span>
            </div>
          `).join('')}
        </div>

        <div class="pros-cons">
          <div class="pro">
            <div class="strategy-item-label">Pros</div>
            ${strategy.pros.map(pro => `
              <div class="pro-con-item pro">
                <span class="pro-con-icon"><i class="fas fa-check"></i></span>
                <span>${pro}</span>
              </div>
            `).join('')}
          </div>
          <div class="con">
            <div class="strategy-item-label">Cons</div>
            ${strategy.cons.map(con => `
              <div class="pro-con-item con">
                <span class="pro-con-icon"><i class="fas fa-times"></i></span>
                <span>${con}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('')}
  `;
}

// ========== PAPER TRADING PAGE ==========
function renderPaperTrading() {
  const positions = appState.portfolio.positions;
  const totalValue = appState.portfolio.cash + positions.reduce((sum, p) => sum + (p.qty * p.currentPrice), 0);
  const totalPnL = totalValue - appState.portfolio.totalDeposited;
  const pnlPercent = ((totalPnL / appState.portfolio.totalDeposited) * 100).toFixed(2);

  return `
    <div class="page-header">
      <h1><i class="fas fa-flask"></i> Paper Trading</h1>
      <p>Practice investing with virtual money — zero real risk</p>
    </div>

    <div class="header-actions">
      <button class="btn btn-secondary" id="reset-btn">
        <i class="fas fa-redo"></i> Reset
      </button>
      <button class="btn" id="add-funds-btn">
        <i class="fas fa-plus"></i> Add Funds
      </button>
    </div>

    <div class="grid grid-4">
      <div class="card">
        <div class="metric-label"><i class="fas fa-piggy-bank"></i> Available Cash</div>
        <div class="metric-value">$${appState.portfolio.cash.toFixed(2)}</div>
        <div class="metric-change" style="font-size: 11px; color: #8892a6;">Total deposited: $${appState.portfolio.totalDeposited.toFixed(2)}</div>
      </div>
      <div class="card">
        <div class="metric-label"><i class="fas fa-shopping-cart"></i> In Positions</div>
        <div class="metric-value">$${(totalValue - appState.portfolio.cash).toFixed(2)}</div>
        <div class="metric-change" style="font-size: 11px; color: #8892a6;">Assets at current price</div>
      </div>
      <div class="card">
        <div class="metric-label"><i class="fas fa-chart-line"></i> Total Portfolio</div>
        <div class="metric-value">$${totalValue.toFixed(2)}</div>
        <div class="metric-change" style="font-size: 11px; color: #8892a6;">Cash + open positions</div>
      </div>
      <div class="card">
        <div class="metric-label"><i class="fas fa-percent"></i> Total P&L</div>
        <div class="metric-value ${totalPnL >= 0 ? 'change-positive' : 'change-negative'}">
          $${totalPnL.toFixed(2)}
        </div>
        <div class="metric-change ${totalPnL >= 0 ? 'change-positive' : 'change-negative'}" style="font-weight: 600;">
          ${totalPnL >= 0 ? '+' : ''}${pnlPercent}%
        </div>
      </div>
    </div>

    <div class="card">
      <h2 style="margin-bottom: 20px;">Place a Trade</h2>
      <p style="color: #8892a6; margin-bottom: 20px; font-size: 13px;">
        Select an asset, enter the quantity — your order executes at the current live market price.
      </p>
      
      <div class="form-row">
        <div class="form-group">
          <label>Select Asset</label>
          <select id="trade-asset">
            <option value="">Choose an asset...</option>
            ${Object.entries(marketData).map(([symbol, data]) => `
              <option value="${symbol}">${symbol} - ${data.name}</option>
            `).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Quantity</label>
          <input id="trade-qty" type="number" step="0.00001" placeholder="Enter quantity" />
        </div>
      </div>

      <div style="display: flex; gap: 12px; margin-top: 20px;">
        <button class="btn" id="trade-buy-btn" style="flex: 1;">
          <i class="fas fa-shopping-cart"></i> Buy
        </button>
      </div>
    </div>

    <div class="card">
      <h2 style="margin-bottom: 20px;">Open Positions</h2>
      ${positions.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fas fa-inbox"></i></div>
          <p>No open positions yet</p>
        </div>
      ` : `
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Qty</th>
              <th>Entry Price</th>
              <th>Current Price</th>
              <th>Value</th>
              <th>P&L</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${positions.map((p, idx) => {
              const value = p.qty * p.currentPrice;
              const pnl = (p.currentPrice - p.entryPrice) * p.qty;
              const pnlPercent = ((pnl / (p.entryPrice * p.qty)) * 100).toFixed(2);
              return `
                <tr>
                  <td><strong>${p.symbol}</strong><br><span style="color: #8892a6; font-size: 11px;">${marketData[p.symbol]?.name}</span></td>
                  <td>${p.qty.toFixed(6)}</td>
                  <td>$${p.entryPrice.toFixed(2)}</td>
                  <td>$${p.currentPrice.toFixed(2)}</td>
                  <td>$${value.toFixed(2)}</td>
                  <td><span class="${pnl >= 0 ? 'change-positive' : 'change-negative'}">
                    ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}<br>
                    (${pnl >= 0 ? '+' : ''}${pnlPercent}%)
                  </span></td>
                  <td><button class="btn btn-small" style="background: #ef4444;" data-sell="${idx}">Sell</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `}
    </div>

    <div class="card">
      <div class="card-header">
        <h2>Trade History</h2>
        <a class="view-all">Show</a>
      </div>
    </div>
  `;
}

function attachPaperTradingEvents() {
  document.getElementById('add-funds-btn').addEventListener('click', () => {
    const amount = prompt('Enter amount to deposit ($):');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      appState.portfolio.cash += parseFloat(amount);
      appState.portfolio.totalDeposited += parseFloat(amount);
      localStorage.setItem('tradescope-portfolio', JSON.stringify(appState.portfolio));
      renderPage('paper');
    }
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Reset your paper trading account to $5,000 initial balance?')) {
      appState.portfolio = {
        cash: 5000,
        positions: [],
        totalDeposited: 5000
      };
      appState.trades = [];
      localStorage.setItem('tradescope-portfolio', JSON.stringify(appState.portfolio));
      localStorage.setItem('tradescope-trades', JSON.stringify(appState.trades));
      renderPage('paper');
    }
  });

  document.getElementById('trade-buy-btn').addEventListener('click', () => {
    const symbol = document.getElementById('trade-asset').value;
    const qty = parseFloat(document.getElementById('trade-qty').value);

    if (!symbol || !qty || qty <= 0) {
      alert('Please select an asset and enter a valid quantity');
      return;
    }

    const asset = marketData[symbol];
    const cost = qty * asset.price;

    if (cost > appState.portfolio.cash) {
      alert(`Insufficient funds. You need $${cost.toFixed(2)} but have $${appState.portfolio.cash.toFixed(2)}`);
      return;
    }

    // Find or create position
    let position = appState.portfolio.positions.find(p => p.symbol === symbol);
    if (!position) {
      position = { symbol, qty: 0, entryPrice: 0, currentPrice: asset.price };
      appState.portfolio.positions.push(position);
    }

    // Update position (average entry price)
    const totalCost = (position.qty * position.entryPrice) + cost;
    position.qty += qty;
    position.entryPrice = totalCost / position.qty;
    position.currentPrice = asset.price;

    // Update cash and trades
    appState.portfolio.cash -= cost;
    appState.trades.push({
      symbol,
      qty,
      price: asset.price,
      type: 'BUY',
      timestamp: new Date().toLocaleString()
    });

    localStorage.setItem('tradescope-portfolio', JSON.stringify(appState.portfolio));
    localStorage.setItem('tradescope-trades', JSON.stringify(appState.trades));
    
    alert(`Bought ${qty} ${symbol} at $${asset.price.toFixed(2)}`);
    renderPage('paper');
  });

  document.querySelectorAll('[data-sell]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.sell);
      const position = appState.portfolio.positions[idx];
      const proceeds = position.qty * position.currentPrice;

      if (confirm(`Sell all ${position.qty.toFixed(6)} ${position.symbol} for $${proceeds.toFixed(2)}?`)) {
        appState.portfolio.cash += proceeds;
        appState.trades.push({
          symbol: position.symbol,
          qty: position.qty,
          price: position.currentPrice,
          type: 'SELL',
          timestamp: new Date().toLocaleString()
        });

        appState.portfolio.positions.splice(idx, 1);
        localStorage.setItem('tradescope-portfolio', JSON.stringify(appState.portfolio));
        localStorage.setItem('tradescope-trades', JSON.stringify(appState.trades));
        renderPage('paper');
      }
    });
  });
}
