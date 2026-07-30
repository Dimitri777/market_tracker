# TradeScope - Market Tracker

A powerful, dark-themed market intelligence dashboard for tracking stocks, cryptocurrencies, and commodities. Analyze real-time market signals, learn investment strategies, and practice paper trading with virtual money—zero real-world risk.

## 🎯 Features

- **Dashboard** — Live market overview with top gainers/losers, crypto market cap, and market sentiment indicators
- **Watchlist** — Track your favorite assets in real-time with price updates and percentage changes
- **Portfolio** — Monitor your simulated holdings, performance metrics, and portfolio P&L
- **Market Signals** — AI-powered trading recommendations with signal strength ratings (bullish, bearish, neutral)
- **Investment Strategies** — 6 proven strategies including HODL, Dollar-Cost Averaging, Momentum Trading, Value Investing, Portfolio Diversification, and Breakout Trading with detailed implementation guides
- **Paper Trading** — Practice buying/selling with $5,000 virtual starting balance, track positions, and analyze your performance without any real money at stake

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 12 or higher) — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or download the repository:**
   ```bash
   git clone <repository-url>
   cd market_tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Application

1. **Start the development server:**
   ```bash
   node server.js
   ```

2. **Open your browser:**
   Navigate to: **http://127.0.0.1:3000**

   You should see the TradeScope dashboard with a dark sidebar on the left and main content area.

3. **Stop the server:**
   Press `Ctrl+C` in your terminal

## 📖 How to Use

### Navigation
- Click menu items in the left sidebar to switch between pages
- **Dashboard** — View market overview and trending assets
- **Watchlist** — Add/remove assets to track by clicking "Add Asset"
- **Portfolio** — See your simulated holdings and performance
- **Signals** — Review AI-generated trading signals
- **Strategies** — Learn about 6 different investment strategies with pros/cons
- **Paper Trading** — Buy and sell virtual assets with your $5,000 starting balance

### Paper Trading Guide

1. **Add Funds** — Click "Add Funds" to deposit more virtual money to your account
2. **Place a Trade:**
   - Select an asset (e.g., BTC, AAPL, ETH)
   - Enter quantity
   - Click "Buy" to execute at current market price
3. **View Positions** — See all open positions in the "Open Positions" table
4. **Sell Assets** — Click "Sell" next to any position to close it
5. **Reset Account** — Click "Reset" to start fresh with $5,000

### Data Storage

All your data is saved locally in your browser:
- Watchlist preferences
- Paper trading portfolio
- Trade history
- Account balance

Data persists even after closing the browser (until browser cache is cleared).

## 📊 Available Assets

### Stocks
- META, AAPL, NFLX, AMZN, MSFT, JPM, NVDA

### Cryptocurrencies
- BTC, ETH, BNB, MATIC, DOGE, DOT, AVAX

### Commodities
- XAU (Gold), XBR (Oil)

Prices are simulated for demo purposes.

## 🛠️ Development

### Project Structure
```
market_tracker/
├── public/
│   ├── index.html      # Main HTML template
│   └── app.js          # Application logic and UI rendering
├── server.js           # Node.js HTTP server
├── package.json        # Dependencies
└── README.md           # This file
```

### Testing
Run the test suite:
```bash
npm test
```

## 📝 Notes

- This is a **paper trading simulator** for educational purposes only
- Prices are simulated and do not reflect real market data
- All trades are virtual with no real money involved
- Data is stored in browser localStorage

## 🎓 Educational Content

The app includes detailed guides for:
- **Buy and Hold (HODL)** — Long-term wealth building
- **Dollar-Cost Averaging (DCA)** — Reduce timing risk
- **Momentum Trading** — Technical analysis approach
- **Value Investing** — Fundamental analysis approach
- **Portfolio Diversification** — Risk management
- **Breakout Trading** — Short-term trading signals

Each strategy includes time horizon, expected returns, implementation steps, and pros/cons analysis.

## 📄 License

Open source for educational purposes.
