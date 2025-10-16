import React, { useState, useEffect } from 'react';
import { useNexus } from '@avail-project/nexus-widgets';
import { useAccount } from 'wagmi';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { AlertCircle, ExternalLink, ArrowRight, Zap, Download, TrendingUp, X, BarChart3 } from 'lucide-react';
import { useHyperliquid } from '../hooks/useHyperliquid';
import { useAster } from '../hooks/useAster';

// DEX configurations
const DEXES = [
  {
    id: 'hyperliquid',
    name: 'Hyperliquid',
    logo: 'https://hyperliquid.gitbook.io/hyperliquid-docs/~gitbook/image?url=https%3A%2F%2F2356094849-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FyUdp569E6w18GdfqlGvJ%252Ficon%252FsIAjqhKKIUysM08ahKPh%252FHL-logoSwitchDISliStat.png%3Falt%3Dmedia%26token%3Da81fa25c-0510-4d97-87ff-3fb8944935b1&width=32&dpr=4&quality=100&sign=3e1219e3&sv=2',
    description: 'Decentralized perpetual exchange',
    supportedChains: ['Ethereum', 'Arbitrum', 'Base', 'Optimism'],
    depositContract: '0x...', // Placeholder
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'aster',
    name: 'Aster',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/36341.png',
    description: 'Cross-chain perpetual protocol',
    supportedChains: ['Ethereum', 'Arbitrum', 'Base'],
    depositContract: '0x...', // Placeholder
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'lighter',
    name: 'Lighter',
    logo: 'https://framerusercontent.com/images/k22lnUP5Ao1xIheAoknaPGmdjXk.svg?width=14&height=26',
    description: 'High-performance perpetual DEX',
    supportedChains: ['Ethereum', 'Arbitrum'],
    depositContract: '0x...', // Placeholder
    color: 'from-green-500 to-emerald-500'
  }
];

const CHAINS = [
  { id: 1, name: 'Ethereum', symbol: 'ETH', logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
  { id: 42161, name: 'Arbitrum', symbol: 'ETH', logo: 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg' },
  { id: 8453, name: 'Base', symbol: 'ETH', logo: 'https://assets.coingecko.com/coins/images/27505/large/lusd.png' },
  { id: 10, name: 'Optimism', symbol: 'ETH', logo: 'https://assets.coingecko.com/coins/images/25244/large/Optimism.png' }
];

const TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', decimals: 18, logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
  { symbol: 'USDC', name: 'USD Coin', decimals: 6, logo: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png' },
  { symbol: 'USDT', name: 'Tether', decimals: 6, logo: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' }
];

// Comprehensive perpetual market data for BTC and ETH across all DEXs
const MARKET_DATA = {
  bitcoin: {
    symbol: 'BTC',
    name: 'Bitcoin',
    logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    price: '$43,250',
    priceChange: '+2.4%',
    color: 'from-orange-500/10 to-yellow-500/10',
    borderColor: 'border-orange-500/20',
    // Market data
    marketCap: '$847B',
    dominance: '42.3%',
    volatility: '68.5%',
    // DEX-specific data
    dexes: {
      hyperliquid: {
        name: 'Hyperliquid',
        logo: 'https://hyperliquid.gitbook.io/hyperliquid-docs/~gitbook/image?url=https%3A%2F%2F2356094849-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FyUdp569E6w18GdfqlGvJ%252Ficon%252FsIAjqhKKIUysM08ahKPh%252FHL-logoSwitchDISliStat.png%3Falt%3Dmedia%26token%3Da81fa25c-0510-4d97-87ff-3fb8944935b1&width=32&dpr=4&quality=100&sign=3e1219e3&sv=2',
        fundingRate: -0.0001,
        liquidity: '$1.2B',
        volume24h: '$680M',
        openInterest: '$450M',
        longShortRatio: '52.3% / 47.7%',
        maxLeverage: '100x',
        makerFee: '0.02%',
        takerFee: '0.05%',
        minOrderSize: '0.001 BTC',
        tickSize: '0.01',
        nextFunding: '2h 15m',
        openInterestChange: '+12.4%',
        volumeChange: '+8.7%',
        liquidations24h: '$25M',
        topTraders: '1,847',
        avgPositionSize: '$15,500',
        isBestFunding: true,
        isBestLiquidity: true
      },
      aster: {
        name: 'Aster',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/36341.png',
        fundingRate: 0.0002,
        liquidity: '$800M',
        volume24h: '$420M',
        openInterest: '$280M',
        longShortRatio: '48.1% / 51.9%',
        maxLeverage: '50x',
        makerFee: '0.025%',
        takerFee: '0.06%',
        minOrderSize: '0.01 BTC',
        tickSize: '0.1',
        nextFunding: '1h 45m',
        openInterestChange: '+8.9%',
        volumeChange: '+5.2%',
        liquidations24h: '$15M',
        topTraders: '1,123',
        avgPositionSize: '$9,750',
        isBestFunding: false,
        isBestLiquidity: false
      },
      lighter: {
        name: 'Lighter',
        logo: 'https://framerusercontent.com/images/k22lnUP5Ao1xIheAoknaPGmdjXk.svg?width=14&height=26',
        fundingRate: -0.0003,
        liquidity: '$400M',
        volume24h: '$200M',
        openInterest: '$120M',
        longShortRatio: '55.2% / 44.8%',
        maxLeverage: '75x',
        makerFee: '0.015%',
        takerFee: '0.04%',
        minOrderSize: '0.005 BTC',
        tickSize: '0.05',
        nextFunding: '3h 30m',
        openInterestChange: '+15.8%',
        volumeChange: '+12.3%',
        liquidations24h: '$5M',
        topTraders: '456',
        avgPositionSize: '$6,250',
        isBestFunding: true,
        isBestLiquidity: false
      }
    }
  },
  ethereum: {
    symbol: 'ETH', 
    name: 'Ethereum',
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    price: '$2,650',
    priceChange: '+1.8%',
    color: 'from-blue-500/10 to-purple-500/10',
    borderColor: 'border-blue-500/20',
    // Market data
    marketCap: '$318B',
    dominance: '18.7%',
    volatility: '72.1%',
    // DEX-specific data
    dexes: {
      hyperliquid: {
        name: 'Hyperliquid',
        logo: 'https://hyperliquid.gitbook.io/hyperliquid-docs/~gitbook/image?url=https%3A%2F%2F2356094849-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FyUdp569E6w18GdfqlGvJ%252Ficon%252FsIAjqhKKIUysM08ahKPh%252FHL-logoSwitchDISliStat.png%3Falt%3Dmedia%26token%3Da81fa25c-0510-4d97-87ff-3fb8944935b1&width=32&dpr=4&quality=100&sign=3e1219e3&sv=2',
        fundingRate: 0.0003,
        liquidity: '$900M',
        volume24h: '$475M',
        openInterest: '$310M',
        longShortRatio: '48.1% / 51.9%',
        maxLeverage: '50x',
        makerFee: '0.025%',
        takerFee: '0.06%',
        minOrderSize: '0.01 ETH',
        tickSize: '0.1',
        nextFunding: '1h 45m',
        openInterestChange: '+8.9%',
        volumeChange: '+5.2%',
        liquidations24h: '$14M',
        topTraders: '961',
        avgPositionSize: '$4,375',
        isBestFunding: false,
        isBestLiquidity: true
      },
      aster: {
        name: 'Aster',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/36341.png',
        fundingRate: -0.0001,
        liquidity: '$600M',
        volume24h: '$300M',
        openInterest: '$200M',
        longShortRatio: '51.2% / 48.8%',
        maxLeverage: '40x',
        makerFee: '0.03%',
        takerFee: '0.07%',
        minOrderSize: '0.05 ETH',
        tickSize: '0.2',
        nextFunding: '2h 30m',
        openInterestChange: '+6.4%',
        volumeChange: '+3.8%',
        liquidations24h: '$8M',
        topTraders: '623',
        avgPositionSize: '$3,250',
        isBestFunding: true,
        isBestLiquidity: false
      },
      lighter: {
        name: 'Lighter',
        logo: 'https://framerusercontent.com/images/k22lnUP5Ao1xIheAoknaPGmdjXk.svg?width=14&height=26',
        fundingRate: 0.0001,
        liquidity: '$300M',
        volume24h: '$175M',
        openInterest: '$110M',
        longShortRatio: '49.8% / 50.2%',
        maxLeverage: '60x',
        makerFee: '0.02%',
        takerFee: '0.05%',
        minOrderSize: '0.02 ETH',
        tickSize: '0.1',
        nextFunding: '4h 15m',
        openInterestChange: '+11.2%',
        volumeChange: '+7.9%',
        liquidations24h: '$6M',
        topTraders: '339',
        avgPositionSize: '$2,875',
        isBestFunding: false,
        isBestLiquidity: false
      }
    }
  }
};

export const PerpPortPage: React.FC = () => {
  const { sdk, isSdkInitialized } = useNexus();
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  const { address: account } = useAppKitAccount();
  const { depositToHyperliquid, withdrawFromHyperliquid, isDepositing: isHyperliquidDepositing, isWithdrawing: isHyperliquidWithdrawing, checkNetwork, switchToArbitrum } = useHyperliquid(true); // Using mainnet
  const { depositToAster, isDepositing: isAsterDepositing } = useAster(true); // Using mainnet

  const [selectedDEX, setSelectedDEX] = useState(DEXES[0]);
  const [selectedChain, setSelectedChain] = useState(CHAINS.find(chain => chain.id === 42161) || CHAINS[0]); // Default to Arbitrum
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [amount, setAmount] = useState('');
  const [isMarketDialogOpen, setIsMarketDialogOpen] = useState(false);
  
  // Auto-select Arbitrum when Hyperliquid is selected
  useEffect(() => {
    if (selectedDEX?.id === 'hyperliquid') {
      const arbitrumChain = CHAINS.find(chain => chain.id === 42161);
      if (arbitrumChain) {
        setSelectedChain(arbitrumChain);
      }
    }
  }, [selectedDEX]);

  const [isDepositing, setIsDepositing] = useState(false);
  const [depositStatus, setDepositStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  
  // Withdrawal state
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawalStatus, setWithdrawalStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [withdrawalTxHash, setWithdrawalTxHash] = useState('');
  const [withdrawalError, setWithdrawalError] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalDestination, setWithdrawalDestination] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Simulate bridge transaction for cost preview
  const simulateBridge = async () => {
    if (!sdk || !isSdkInitialized || !selectedToken || !amount) {
      return;
    }

    try {
      const simulationParams = {
        token: selectedToken.symbol as any,
        amount: parseFloat(amount),
        chainId: selectedChain.id as any,
      };

      console.log('PerpPort simulation parameters:', simulationParams);
      
      const simulation = await sdk.simulateBridge(simulationParams);
      console.log('PerpPort simulation result:', simulation);
      
    } catch (error) {
      console.error('PerpPort simulation failed:', error);
    }
  };

  // Simulate when amount changes
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      simulateBridge();
    }
  }, [amount, selectedToken, selectedChain, sdk, isSdkInitialized]);

  const handleDeposit = async () => {
    if (!isConnected) {
      open();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      setDepositStatus('error');
      return;
    }

    // Validate minimum amount for Hyperliquid and Aster (5 USDC)
    if ((selectedDEX.id === 'hyperliquid' || selectedDEX.id === 'aster') && parseFloat(amount) < 5) {
      setError(`Minimum deposit amount for ${selectedDEX.name} is 5 USDC`);
      setDepositStatus('error');
      return;
    }

    // Validate token selection for Hyperliquid and Aster (only USDC supported)
    if ((selectedDEX.id === 'hyperliquid' || selectedDEX.id === 'aster') && selectedToken.symbol !== 'USDC') {
      setError(`${selectedDEX.name} only supports USDC deposits`);
      setDepositStatus('error');
      return;
    }

    setIsDepositing(true);
    setDepositStatus('processing');
    setError('');

    try {
      console.log('Starting PerpPort deposit...', {
        dex: selectedDEX.name,
        chain: selectedChain.name,
        token: selectedToken.symbol,
        amount: amount
      });

      let depositResult;

      if (selectedDEX.id === 'hyperliquid') {
        // Direct deposit to Hyperliquid using their bridge
        console.log('Depositing directly to Hyperliquid...');
        depositResult = await depositToHyperliquid(amount);
        
        if (depositResult.success) {
          setTxHash(depositResult.txHash || '');
          setDepositStatus('success');
          console.log('Hyperliquid deposit successful:', depositResult);
        } else {
          throw new Error(depositResult.error || 'Hyperliquid deposit failed');
        }
      } else if (selectedDEX.id === 'aster') {
        // Direct deposit to Aster using their bridge
        console.log('Depositing directly to Aster...');
        depositResult = await depositToAster(amount);
        
        if (depositResult.success) {
          setTxHash(depositResult.txHash || '');
          setDepositStatus('success');
          console.log('Aster deposit successful:', depositResult);
        } else {
          throw new Error(depositResult.error || 'Aster deposit failed');
        }
      } else {
        // For other DEXes, use the existing bridge logic
        if (!sdk || !isSdkInitialized) {
          throw new Error('Nexus SDK not initialized');
        }

        // First bridge the tokens to the target chain
        const bridgeParams = {
          token: selectedToken.symbol as any,
          amount: parseFloat(amount),
          chainId: selectedChain.id as any,
        };

        console.log('Bridge Parameters:', bridgeParams);
        
        const bridgeResult = await sdk.bridge(bridgeParams);
        
        if (!bridgeResult.success) {
          throw new Error(bridgeResult.error || 'Bridge failed');
        }

        // Simulate the deposit to the DEX
        console.log('Bridge successful, simulating DEX deposit...');
        
        depositResult = {
          success: true,
          txHash: bridgeResult.explorerUrl || 'Deposit completed',
          message: `Successfully deposited ${amount} ${selectedToken.symbol} to ${selectedDEX.name}`
        };

        if (depositResult.success) {
          setTxHash(depositResult.txHash);
          setDepositStatus('success');
          console.log('PerpPort deposit successful:', depositResult);
        } else {
          throw new Error(depositResult.message || 'Deposit failed');
        }
      }
    } catch (error) {
      console.error('PerpPort deposit failed:', error);
      let errorMessage = 'Deposit failed. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds for this deposit';
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transaction was cancelled by user';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection';
        } else if (error.message.includes('Minimum deposit amount')) {
          errorMessage = error.message;
        } else if (error.message.includes('only supports USDC')) {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setDepositStatus('error');
    } finally {
      setIsDepositing(false);
    }
  };

  const getStatusMessage = () => {
    switch (depositStatus) {
      case 'processing':
        return 'Processing deposit...';
      case 'success':
        return 'Deposit successful!';
      case 'error':
        return 'Deposit failed';
      default:
        return 'Ready to deposit';
    }
  };

  // Withdrawal handler
  const handleWithdrawal = async () => {
    if (!amount || !account) {
      setError('Please enter withdrawal amount and connect wallet');
      return;
    }

    setIsWithdrawing(true);
    setError('');

    try {
      let withdrawalResult;

      if (selectedDEX.id === 'hyperliquid') {
        // Withdraw from Hyperliquid using EIP-712 signature
        console.log('Withdrawing from Hyperliquid...');
        withdrawalResult = await withdrawFromHyperliquid(amount, account);
        
        if (withdrawalResult.success) {
          setWithdrawalStatus('success');
          setWithdrawalTxHash(withdrawalResult.txHash || '');
          setShowSuccessDialog(true);
        } else {
          setWithdrawalStatus('error');
          setWithdrawalError(withdrawalResult.error || 'Withdrawal failed');
        }
      } else {
        setWithdrawalStatus('error');
        setWithdrawalError('Withdrawal not supported for this DEX');
      }
      
    } catch (error) {
      console.error('Withdrawal error:', error);
      setError('Withdrawal failed. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="min-h-screen py-8 relative bg-black overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.05)_0%,transparent_50%)]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fadeIn">
          <div className="inline-flex items-center px-6 py-3 bg-black/20 backdrop-blur-2xl border border-white/20 rounded-full text-gray-200 text-sm font-bold mb-6 shadow-2xl hover:shadow-3xl transition-all duration-500 group ring-1 ring-white/10 hover:ring-white/20">
            <span className="group-hover:text-white transition-all duration-500 tracking-wider uppercase bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-purple-100 group-hover:to-white">Cross-Chain • Perpetual Deposits</span>
          </div>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4 animate-fadeIn" style={{animationDelay: '0.2s'}}>
            Deposit to your favorite perpetual DEX — from any chain, in one click.
          </p>
        </div>

        {/* Main Card */}
        <div className="animate-fadeIn" style={{animationDelay: '0.6s'}}>
          <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 sm:p-12 md:p-16 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 group">
            {/* Enhanced background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.03)_0%,transparent_50%)]"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="relative z-10 space-y-8 sm:space-y-12">
              {/* DEX Selection */}
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-200 mb-2 sm:mb-3">
                  Select DEX
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DEXES.map((dex) => (
                    <button
                      key={dex.id}
                      onClick={() => setSelectedDEX(dex)}
                      className={`p-4 rounded-xl border transition-all duration-300 backdrop-blur-xl ${
                        selectedDEX.id === dex.id
                          ? 'border-white/50 bg-white/10 shadow-lg shadow-white/20 scale-105'
                          : 'border-white/20 bg-black/40 hover:border-white/30 hover:bg-black/50 hover:scale-102'
                      }`}
                    >
                        <div className="flex items-center space-x-3">
                          <img src={dex.logo} alt={dex.name} className="w-8 h-8 rounded-full" />
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-white">{dex.name}</div>
                            <div className="text-sm text-gray-400">{dex.description}</div>
                          </div>
                        </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuration Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Chain Selection */}
                <div className="bg-black/20 backdrop-blur-xl border border-white/15 rounded-xl p-6 shadow-lg ring-1 ring-white/5">
                  <label className="block text-sm sm:text-base font-semibold text-gray-200 mb-3">
                    From Chain
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {CHAINS.map((chain) => (
                      <button
                        key={chain.id}
                        onClick={() => setSelectedChain(chain)}
                        className={`p-3 rounded-lg border transition-all duration-300 backdrop-blur-xl ${
                          selectedChain.id === chain.id
                            ? 'border-white/50 bg-white/10 shadow-lg shadow-white/20 scale-105'
                            : 'border-white/20 bg-black/40 hover:border-white/30 hover:bg-black/50 hover:scale-102'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={chain.logo} alt={chain.name} className="w-5 h-5 rounded-full" />
                          <span className="text-sm font-medium text-white">{chain.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Token Selection */}
                <div className="bg-black/20 backdrop-blur-xl border border-white/15 rounded-xl p-6 shadow-lg ring-1 ring-white/5">
                  <label className="block text-sm sm:text-base font-semibold text-gray-200 mb-3">
                    Token
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {TOKENS.map((token) => (
                      <button
                        key={token.symbol}
                        onClick={() => setSelectedToken(token)}
                        className={`p-3 rounded-lg border transition-all duration-300 backdrop-blur-xl ${
                          selectedToken.symbol === token.symbol
                            ? 'border-white/50 bg-white/10 shadow-lg shadow-white/20 scale-105'
                            : 'border-white/20 bg-black/40 hover:border-white/30 hover:bg-black/50 hover:scale-102'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={token.logo} alt={token.name} className="w-5 h-5 rounded-full" />
                          <span className="text-sm font-medium text-white">{token.symbol}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-8">
                <label className="block text-sm sm:text-base font-semibold text-gray-200 mb-3">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-4 bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-white/50 focus:outline-none transition-all duration-300 text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none selection:bg-white/20 selection:text-white"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400 text-sm font-medium">{selectedToken.symbol}</span>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {depositStatus === 'error' && (
                <div className="mb-6 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                    <span className="text-red-300 text-sm font-medium">
                      {error}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons - Deposit and Withdraw Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Deposit Button */}
                <button
                  onClick={handleDeposit}
                  disabled={isDepositing || isHyperliquidDepositing || isAsterDepositing || !isConnected || !amount}
                  className={`py-4 px-6 backdrop-blur-3xl border text-white focus:ring-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-white/20 hover:ring-white/30 hover:scale-[1.02] active:scale-[0.98] group ${
                    depositStatus === 'success' 
                      ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' 
                      : 'bg-white/5 border-white/30 hover:bg-white/10 hover:border-white/40'
                  }`}
                >
                  {(isDepositing || isHyperliquidDepositing || isAsterDepositing) ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : depositStatus === 'success' ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span>Success!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>Deposit</span>
                    </div>
                  )}
                </button>

                {/* Withdrawal Button */}
                <button
                  onClick={handleWithdrawal}
                  disabled={isWithdrawing || isHyperliquidWithdrawing || !isConnected || !amount}
                  className="py-4 px-6 backdrop-blur-3xl border text-white focus:ring-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-white/20 hover:ring-white/30 hover:scale-[1.02] active:scale-[0.98] group bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
                >
                  {(isWithdrawing || isHyperliquidWithdrawing) ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-red-300/30 border-t-red-300 rounded-full animate-spin"></div>
                      <span>Creating Withdrawal Signature...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Withdraw from Hyperliquid</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Transaction Link - Show only on success */}
              {depositStatus === 'success' && txHash && (
                <div className="mt-4 text-center">
                  <a
                    href={`https://arbiscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
                  >
                    <span>View Transaction on Arbiscan</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}


            </div>
          </div>
        </div>
      </div>

      {/* Floating Market Data Button */}
      <button
        onClick={() => setIsMarketDialogOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] w-12 h-12 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 backdrop-blur-xl border border-emerald-400/40 rounded-full text-emerald-300 shadow-2xl hover:shadow-emerald-500/25 hover:shadow-3xl transition-all duration-500 group ring-1 ring-emerald-400/30 hover:ring-emerald-300/50 hover:scale-110 flex items-center justify-center overflow-hidden animate-pulse hover:animate-none"
        title="View Market Data"
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping"></div>
        
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping"></div>
        
        {/* Icon with bounce animation */}
        <BarChart3 className="w-5 h-5 group-hover:text-white transition-all duration-500 group-hover:animate-bounce relative z-10" />
        
        {/* Subtle floating animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 animate-pulse"></div>
      </button>

      {/* Market Data Dialog */}
      {isMarketDialogOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-black/30 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-white/10 relative">
            <button
              onClick={() => setIsMarketDialogOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-all duration-300 backdrop-blur-xl border border-white/10 z-10"
            >
              <X className="w-4 h-4 text-gray-300" />
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(MARKET_DATA).map(([key, asset]) => (
                <div key={key} className="bg-black/10 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl ring-1 ring-white/5">
                  {/* Asset Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={asset.logo} alt={asset.name} className="w-8 h-8 rounded-full" />
                      <p className="text-lg text-white font-bold">{asset.price}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${asset.priceChange.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {asset.priceChange}
                    </span>
                  </div>
                  
                  {/* DEX Comparison */}
                  <div className="space-y-4">
                    {Object.entries(asset.dexes).map(([dexKey, dex]) => (
                      <div key={dexKey} className="bg-black/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 shadow-xl ring-1 ring-white/5">
                        {/* DEX Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <img src={dex.logo} alt={dex.name} className="w-8 h-8 rounded-full" />
                            <h4 className="text-lg font-bold text-white">{dex.name}</h4>
                          </div>
                          <div className="flex gap-2">
                            {dex.isBestFunding && (
                              <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                                Best Funding
                              </span>
                            )}
                            {dex.isBestLiquidity && (
                              <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                                Best Liquidity
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* DEX Data Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">Funding Rate:</span>
                              <span className={`font-bold text-sm ${dex.fundingRate < 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {dex.fundingRate > 0 ? '+' : ''}{(dex.fundingRate * 100).toFixed(3)}%
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">Liquidity:</span>
                              <span className="text-white font-bold text-sm">{dex.liquidity}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">24h Volume:</span>
                              <span className="text-white font-bold text-sm">{dex.volume24h}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">Open Interest:</span>
                              <span className="text-white font-bold text-sm">{dex.openInterest}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-sm text-center">
                💡 <strong>Pro Tip:</strong> Negative funding rates mean longs pay shorts (bullish sentiment). 
                Choose the DEX with the best rates for your position!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl animate-fadeIn backdrop-blur-xl">
            {/* Success Icon with Animation */}
            <div className="text-center mb-8">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce">
                <svg className="w-12 h-12 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Success Message */}
              <h3 className="text-3xl font-bold text-white mb-4">
                Withdrawal Signature Created! 🎉
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-lg mx-auto">
                Your EIP-712 signature has been generated successfully. You can now submit this to Hyperliquid to complete your withdrawal.
              </p>
            </div>
            
            {/* Signature Details */}
            <div className="bg-black/30 border border-green-500/20 rounded-xl p-6 mb-8">
              <div className="text-left">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-base font-semibold text-green-400">Signature Hash</span>
                  </div>
                  <button
                    onClick={(e) => {
                      navigator.clipboard.writeText(withdrawalTxHash);
                      // Show brief copy feedback
                      const btn = e.target as HTMLButtonElement;
                      const originalText = btn.textContent;
                      btn.textContent = '✓ Copied!';
                      btn.className = 'text-sm text-green-400 font-medium px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 transition-all duration-200';
                      setTimeout(() => {
                        btn.textContent = originalText;
                        btn.className = 'text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10';
                      }, 2000);
                    }}
                    className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:scale-105 active:scale-95"
                  >
                    Copy
                  </button>
                </div>
                <div className="font-mono text-sm text-gray-300 break-all bg-black/40 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                  {withdrawalTxHash}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowSuccessDialog(false);
                  setWithdrawalStatus('idle');
                  setWithdrawalTxHash('');
                  setAmount('');
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 text-green-100 font-semibold rounded-xl hover:from-green-500/30 hover:to-emerald-500/30 hover:border-green-300/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Create Another Withdrawal</span>
              </button>
              <button
                onClick={() => setShowSuccessDialog(false)}
                className="flex-1 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
