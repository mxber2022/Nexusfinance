# NexusFinance

A revolutionary cross-chain DeFi hub powered by Avail Nexus SDK, enabling seamless gas refueling, yield optimization, and perpetual trading across multiple blockchain networks.

## 🚀 Features

### ⛽ Cross-Chain Gas Refuel
- **Universal Token Support**: Use any token from any network to refuel native gas on any chain
- **Lightning-Fast Settlement**: Powered by Avail Nexus SDK for cross-chain execution in under 5 minutes
- **Multi-Chain Support**: Support for 15+ chains including Ethereum, Arbitrum, Avalanche, Polygon, BSC, and more
- **Smart Routing**: Automatically finds the most efficient path for your cross-chain transactions

### 📈 FlowFi - Auto Yield Optimization
- **Intelligent Yield Chasing**: Automatically moves idle stablecoins to the best yield platforms across chains
- **Multi-Protocol Support**: Integrates with Aave, Morpho, Compound, and Euler protocols
- **Auto Rebalancing**: Every 7 days, AI agent rebalances to maintain optimal yield
- **One-Click Execution**: Bridge and deposit to target yield pools in a single transaction

### ⚡ PerpPort - Cross-Chain Perpetual Deposits
- **Multi-DEX Support**: Deposit to Hyperliquid, Aster, Lighter, and other leading perpetual exchanges
- **Cross-Chain Native**: Deposit from any supported chain without manual bridging
- **Real-Time Market Data**: Live funding rates, liquidity, and volume data across all DEXs
- **One-Click Deposits**: Bridge and deposit to your favorite perpetual DEX in a single transaction

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom animations
- **Blockchain**: Wagmi, Viem, Ethers.js
- **Cross-Chain**: Avail Nexus SDK
- **Wallet Integration**: Reown AppKit (WalletConnect)
- **State Management**: TanStack Query
- **UI Components**: Lucide React icons

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mxber2022/nexusfinance.git
   cd nexusfinance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   ```
   
   Update the environment variables in `.env.local`:

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Header, Footer
│   ├── sections/        # Page sections
│   └── ui/              # UI components (Button, Card, etc.)
├── constants/           # Chain and token configurations
├── hooks/               # Custom React hooks
├── pages/               # Main application pages
│   ├── HomePage.tsx     # Landing page
│   ├── GasRefuelPage.tsx # Gas refueling interface
│   ├── FlowFiPage.tsx   # Yield optimization
│   └── PerpPortPage.tsx # Perpetual deposits
├── providers/           # React context providers
├── services/            # External service integrations
└── types/               # TypeScript type definitions
```

## 🔧 Configuration

### Supported Chains
- Ethereum (1)
- Base (8453)
- Arbitrum (42161)
- Optimism (10)
- Polygon (137)
- Avalanche (43114)
- Scroll (534352)
- Sophon (50104)
- Kaia (8217)
- BNB (56)
- HyperEVM (999)

### Supported Tokens
- Native tokens (ETH, AVAX, MATIC, etc.)
- Stablecoins (USDC, USDT, DAI)
- Wrapped tokens (WETH, WAVAX, etc.)

## 🚀 Usage

### Gas Refueling
1. Connect your wallet
2. Select source chain (where you have tokens)
3. Choose destination chain (where you need gas)
4. Enter refuel amount
5. Click "Refuel" to execute cross-chain transaction

### Yield Optimization
1. Select your stablecoin (USDC, USDT, DAI)
2. Choose target protocol (Aave, Morpho, Compound, Euler)
3. Enter amount to optimize
4. Enable auto-rebalancing (optional)
5. Click "Move Now" to execute

### Perpetual Deposits
1. Select your preferred DEX (Hyperliquid, Aster, Lighter)
2. Choose source chain and token
3. Enter deposit amount
4. Click "Deposit" to bridge and deposit in one transaction

## 🔒 Security

- **Audited Smart Contracts**: All integrations use battle-tested, audited protocols
- **Non-Custodial**: Users maintain full control of their assets
- **Transparent**: All transactions are verifiable on-chain
- **Secure Wallets**: Supports all major wallet providers

## 🌐 Network Support

### Mainnet Chains
- Ethereum
- Arbitrum
- Base
- Optimism
- Polygon
- Avalanche
- Scroll
- BNB Smart Chain

### Testnet Support
- Sepolia
- Arbitrum Sepolia
- Base Sepolia
- Polygon Mumbai

## 📊 Analytics & Monitoring

- **Real-time Balance Tracking**: Monitor your assets across all chains
- **Transaction History**: Complete record of all cross-chain operations
- **Yield Performance**: Track your yield optimization results
- **Gas Fee Optimization**: Smart routing to minimize transaction costs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.nexusfinance.com](https://docs.nexusfinance.com)
- **Discord**: [discord.gg/nexusfinance](https://discord.gg/nexusfinance)
- **Twitter**: [@NexusFinance](https://twitter.com/NexusFinance)
- **Email**: support@nexusfinance.com

## 🙏 Acknowledgments

- [Avail Nexus SDK](https://github.com/availproject/nexus) for cross-chain infrastructure
- [Reown AppKit](https://github.com/WalletConnect/appkit) for wallet connectivity
- [Wagmi](https://wagmi.sh/) for Ethereum integration
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Built with ❤️ by the NexusFinance team**

*Revolutionizing cross-chain DeFi, one transaction at a time.*
