# NexusFinance

**KING OF PERPS** - The Universal Perpetual Aggregator. Trade any perpetual, anywhere, with one click. A revolutionary cross-chain DeFi platform powered by Avail Nexus SDK, enabling seamless perpetual trading, gas refueling, and unified USDC/USDT deposits to the highest yield generating markets.

## 🚨 The Problem We Solve

### Blockchain Fragmentation in Derivatives Markets
Traders face significant barriers when trying to access the best perpetual trading opportunities across different blockchains and DEXs:

- **Capital Inefficiency**: Assets scattered across chains, manual bridging required
- **Operational Complexity**: Multiple wallet connections, chain switching friction  
- **Market Inefficiency**: Missed arbitrage opportunities, fragmented access

### Our Solution
NexusFinance provides a unified platform that eliminates these barriers:

- **Unified Access**: One-click deposits to any DEX from any chain
- **Optimized Routing**: Automated gas optimization, minimal costs
- **Real-Time Intelligence**: Live funding rate comparison across DEXs

## 🚀 What We've Built

### ⚡ PerpPort - Universal Perpetual Aggregator
- **Multi-DEX Integration**: Seamlessly trade on Hyperliquid, Aster, Reya, and Lighter
- **Cross-Chain Native**: Deposit from Ethereum, Arbitrum, BNB Smart Chain, and Solana
- **Unified Trading Interface**: Single dashboard for all perpetual DEXes
- **Real-Time Market Data**: Live funding rates, liquidity, and volume across all platforms
- **One-Click Position Opening**: Bridge USDC and open positions in a single transaction
- **Smart Execution**: Automatic routing to best liquidity and rates

### ⛽ Cross-Chain Gas Refuel
- **Universal Token Support**: Use ETH, USDC, USDT from any network to refuel gas on any chain
- **Multi-Chain Support**: Ethereum, Arbitrum, BNB Smart Chain, Solana
- **Unified Balance Display**: See your total balance across all chains
- **Lightning-Fast Settlement**: Powered by Avail Nexus SDK for cross-chain execution
- **Smart Routing**: Automatically finds the most efficient path for your transactions

### 💰 FlowFi - Auto Yield Optimization
- **Unified Balance Integration**: Real-time balance fetching from Nexus SDK across all chains
- **Multi-Protocol Support**: Aave, Morpho, Compound, Euler integration
- **Auto Rebalancing**: AI-powered yield optimization every 7 days
- **Cross-Chain Yield Farming**: Automatically move assets to highest-yielding protocols
- **Smart Execution**: Bridge and deposit to optimal protocols in single transaction

### 🔧 Advanced Features
- **Nexus SDK Integration**: Seamless cross-chain bridging with `bridgeAndExecute`
- **Position Management**: Open long/short positions with leverage on any supported DEX
- **Unified Deposits**: Deposit unified USDC/USDT to the highest yield generating markets
- **Market Data Integration**: Real-time funding rates and best execution
- **Wallet Integration**: Support for all major wallets via Reown AppKit
- **Responsive Design**: Modern UI with Tailwind CSS and smooth animations

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
│   ├── sections/        # Page sections (HeroSection)
│   ├── ui/              # UI components (Button, Card, etc.)
│   ├── PositionDialog.tsx # Position opening dialog with leverage slider
│   ├── PositionsDisplay.tsx # User positions display with DEX info
│   ├── MarketDataDialog.tsx # Market data display
│   └── OpenPositionButton.tsx # Position opening button
├── constants/           # Chain and token configurations
│   ├── chains.ts        # Supported blockchain networks
│   ├── tokens.ts        # Supported tokens
│   ├── dexes.ts         # DEX configurations
│   └── marketData.ts    # Market data constants
├── hooks/               # Custom React hooks
│   ├── useHyperliquid.ts # Hyperliquid integration
│   ├── useHyperliquidData.ts # Hyperliquid market data
│   ├── useHyperliquidPosition.ts # Position management and balance fetching
│   ├── useAster.ts      # Aster integration
│   ├── useAsterData.ts  # Aster market data
│   ├── useReyaData.ts   # Reya market data
│   └── useTokenBalances.ts # Unified token balance management
├── pages/               # Main application pages
│   ├── HomePage.tsx     # Landing page with problem/solution section
│   ├── GasRefuelPage.tsx # Gas refueling interface
│   ├── FlowFiPage.tsx   # Auto yield optimization with Nexus balance integration
│   └── PerpPortPage.tsx # Perpetual trading interface with position management
├── providers/           # React context providers
│   └── AppKitProvider.tsx # Wallet connection provider
├── services/            # External service integrations
│   ├── hyperliquid.ts  # Hyperliquid SDK integration
│   ├── hyperliquidApi.ts # Hyperliquid API client
│   ├── hyperliquidPosition.ts # Position management
│   ├── aster.ts         # Aster integration
│   ├── asterApi.ts      # Aster API client
│   └── reyaApi.ts       # Reya API client
└── types/               # TypeScript type definitions
    └── index.ts         # Shared type definitions
```

## 🔧 Configuration

### Supported Chains
- **Ethereum** (1) - Mainnet
- **Arbitrum** (42161) - Layer 2 scaling
- **BNB Smart Chain** (56) - Binance ecosystem
- **Solana** (1399811149) - High-performance blockchain

### Supported Tokens
- **ETH** - Ethereum native token
- **USDC** - USD Coin (6 decimals)
- **USDT** - Tether (6 decimals)
- **SOL** - Solana native token (9 decimals)

### Supported DEXes
- **Hyperliquid** - Decentralized perpetual exchange
- **Aster** - Cross-chain perpetual protocol
- **Reya** - Cross-chain perpetual protocol
- **Lighter** - Coming soon

## 🚀 Usage

### Perpetual Trading (PerpPort)
1. **Connect your wallet** using any supported wallet provider
2. **Select your DEX** - Choose from Hyperliquid, Aster, Reya, or Lighter
3. **Choose your token** - Select ETH, USDC, USDT, or SOL
4. **Enter deposit amount** - Specify how much you want to deposit
5. **Click "Deposit"** - The platform will automatically bridge and deposit to your chosen DEX
6. **Open positions** - Use the unified interface to open long/short positions with leverage

### Gas Refueling
1. **Connect your wallet** to access your balances
2. **Select destination chain** - Choose where you need gas (Ethereum, Arbitrum, BNB, Solana)
3. **Choose your token** - Use ETH, USDC, or USDT to refuel
4. **Enter refuel amount** - Specify how much gas you need
5. **Click "Refuel"** - Execute cross-chain transaction to refuel your destination chain

### Auto Yield Optimization (FlowFi)
1. **Connect your wallet** to access unified balances across all chains
2. **Select your asset** - Choose from USDC, USDT, or ETH
3. **Choose target protocol** - Select from Aave, Morpho, Compound, or Euler
4. **Enter amount** - Specify how much to optimize
5. **Enable auto-rebalancing** - Set up automatic yield optimization every 7 days
6. **Click "Move Now"** - Execute cross-chain bridge and deposit to optimal protocol

### Key Features
- **Unified Balance Display**: See your total balance across all chains
- **One-Click Operations**: Bridge and deposit in a single transaction
- **Real-Time Data**: Live funding rates and market data
- **Cross-Chain Native**: No manual bridging required

## 🔒 Security

- **Audited Smart Contracts**: All integrations use battle-tested, audited protocols
- **Non-Custodial**: Users maintain full control of their assets
- **Transparent**: All transactions are verifiable on-chain
- **Secure Wallets**: Supports all major wallet providers

## 🌐 Network Support

### Production Ready
- **Ethereum** - Mainnet with full USDC/USDT support
- **Arbitrum** - Layer 2 scaling with optimized gas costs
- **BNB Smart Chain** - Binance ecosystem integration
- **Solana** - High-performance blockchain support

### DEX Integrations
- **Hyperliquid** - Full integration with position opening
- **Aster** - Cross-chain perpetual protocol
- **Reya** - Cross-chain perpetual protocol
- **Lighter** - Coming soon

### Cross-Chain Infrastructure
- **Avail Nexus SDK** - Seamless cross-chain bridging
- **Bridge and Execute** - Single transaction for bridge + deposit
- **Unified Balances** - Cross-chain balance aggregation
- **Smart Routing** - Optimal path selection

## 🔧 Technical Implementation

### Core Services
- **Hyperliquid Integration**: Full SDK integration with position opening, market data, and balance management
- **Aster Integration**: Cross-chain deposit functionality with Nexus SDK bridge and execute
- **Reya Integration**: Market data and funding rate aggregation
- **Gas Refuel Service**: Cross-chain gas refueling with unified balance display

### Key Features Implemented
- **Nexus SDK Integration**: `bridgeAndExecute` for seamless cross-chain operations
- **Position Management**: Open long/short positions with leverage on Hyperliquid (up to 40x)
- **Unified Deposits**: Deposit unified USDC/USDT to highest yield markets
- **Market Data**: Real-time funding rates, liquidity, and volume data
- **Unified UI**: Single interface for all perpetual DEXes
- **Cross-Chain Balances**: Aggregate balances across all supported chains
- **Position Display**: View all positions with DEX info and asset icons
- **PnL Tracking**: Real-time PnL indicators with floating values
- **Auto Yield Optimization**: AI-powered yield farming across protocols
- **Problem/Solution Section**: Clear explanation of blockchain fragmentation issues

### Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom animations
- **Blockchain**: Wagmi + Viem + Ethers.js
- **Cross-Chain**: Avail Nexus SDK
- **Wallet**: Reown AppKit (WalletConnect)
- **State**: TanStack Query for data fetching

## 📊 Analytics & Monitoring

- **Real-time Balance Tracking**: Monitor your assets across all chains
- **Transaction History**: Complete record of all cross-chain operations
- **Market Data**: Live funding rates and liquidity across all DEXes
- **Position Tracking**: Monitor your perpetual positions across platforms

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
