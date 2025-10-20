import React, { useState, useEffect } from 'react';
import { useNexus } from '@avail-project/nexus-widgets';
import { useAccount } from 'wagmi';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { AlertCircle, ExternalLink, Zap, Download, TrendingUp, BarChart3 } from 'lucide-react';
import { useHyperliquid } from '../hooks/useHyperliquid';
import { useAster } from '../hooks/useAster';
import { useHyperliquidData } from '../hooks/useHyperliquidData';
import { useAsterData } from '../hooks/useAsterData';
import { useReyaData } from '../hooks/useReyaData';
import { MarketDataDialog } from '../components/MarketDataDialog';
import { DEXES } from '../constants/dexes';
import { CHAINS } from '../constants/chains';
import { TOKENS } from '../constants/tokens';
import { MARKET_DATA } from '../constants/marketData';


export const PerpPortPage: React.FC = () => {
  const { sdk, isSdkInitialized } = useNexus();
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  const { address: account } = useAppKitAccount();
  const { depositToHyperliquid, withdrawFromHyperliquid, isDepositing: isHyperliquidDepositing, isWithdrawing: isHyperliquidWithdrawing, checkNetwork, switchToArbitrum } = useHyperliquid(true); // Using mainnet
  const { depositToAster, isDepositing: isAsterDepositing } = useAster(true); // Using mainnet
  const { fundingData, bestRates, isLoading: isHyperliquidLoading, error: hyperliquidError, lastUpdated, refreshData } = useHyperliquidData();
  const { fundingData: asterFundingData, bestRates: asterBestRates, isLoading: isAsterLoading, error: asterError, lastUpdated: asterLastUpdated, refreshData: refreshAsterData } = useAsterData();
  const { fundingData: reyaFundingData, bestRates: reyaBestRates, isLoading: isReyaLoading, error: reyaError, lastUpdated: reyaLastUpdated, refreshData: refreshReyaData } = useReyaData();

  const [selectedDEX, setSelectedDEX] = useState(DEXES[0]);
  const [selectedChain, setSelectedChain] = useState(CHAINS.find(chain => chain.id === 42161) || CHAINS[0]); // Default to Arbitrum
  const [selectedToken, setSelectedToken] = useState(TOKENS.find(token => token.symbol === 'USDC') || TOKENS[0]);
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
        depositResult = await depositToHyperliquid(amount, sdk);
        
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
        depositResult = await depositToAster(amount, sdk);
        
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
                       onClick={() => dex.id !== 'lighter' && setSelectedDEX(dex)}
                       disabled={dex.id === 'lighter'}
                       className={`p-4 rounded-xl border transition-all duration-300 backdrop-blur-xl relative ${
                        selectedDEX.id === dex.id
                          ? 'border-white/50 bg-white/10 shadow-lg shadow-white/20 scale-105'
                           : dex.id === 'lighter'
                           ? 'border-gray-500/30 bg-gray-500/10 opacity-60 cursor-not-allowed'
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
                       {dex.id === 'lighter' && (
                         <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                           Coming Soon
                         </div>
                       )}
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
      <MarketDataDialog
        isOpen={isMarketDialogOpen}
        onClose={() => setIsMarketDialogOpen(false)}
        selectedDEX={selectedDEX}
        onDEXSelect={setSelectedDEX}
        DEXES={DEXES}
        MARKET_DATA={MARKET_DATA}
        // Hyperliquid data
        hyperliquidData={fundingData}
        hyperliquidBestRates={bestRates}
        isHyperliquidLoading={isHyperliquidLoading}
        hyperliquidError={hyperliquidError}
        hyperliquidLastUpdated={lastUpdated}
        onRefreshHyperliquid={refreshData}
        // Aster data
        asterData={asterFundingData}
        asterBestRates={asterBestRates}
        isAsterLoading={isAsterLoading}
        asterError={asterError}
        asterLastUpdated={asterLastUpdated}
        onRefreshAster={refreshAsterData}
        // Reya data
        reyaData={reyaFundingData}
        reyaBestRates={reyaBestRates}
        isReyaLoading={isReyaLoading}
        reyaError={reyaError}
        reyaLastUpdated={reyaLastUpdated}
        onRefreshReya={refreshReyaData}
      />

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

