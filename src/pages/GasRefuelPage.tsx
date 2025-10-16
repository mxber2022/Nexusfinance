import React, { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { Fuel, Zap, ArrowRight, CheckCircle, AlertCircle, Loader, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ChainSelector } from '../components/ui/ChainSelector';
import { TokenSelector } from '../components/ui/TokenSelector';
import { StatCard } from '../components/ui/StatCard';
import { useChains } from '../hooks/useChainsrefuel';
import { useTokens } from '../hooks/useTokensRefuel';
import { useTokenBalances } from '../hooks/useTokenBalances';
import { getBestGasToken } from '../constants/tokensRefuel';
import {
  BridgeAndExecuteButton,
  BridgeButton,
  TransferButton,
  // SwapButton,
  useNexus,
} from '@avail-project/nexus-widgets';
import type { BridgeParams, BridgeResult, SimulationResult } from '@avail-project/nexus';
import type { GasRefuelPageProps, Chain, Token, RefuelData } from '../types';

export function GasRefuelPage({ onRefuelComplete }: GasRefuelPageProps) {
  const { chains } = useChains();
  const { tokens, getTokensByChain } = useTokens(chains);
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { address: appKitAddress } = useAppKitAccount();
  const { sdk, isSdkInitialized } = useNexus();
  
  const connectedAddress = appKitAddress || address;
  const isWalletConnected = connectedAddress ? true : isConnected;
  
  const [sourceChain, setSourceChain] = useState<Chain>(chains[0]);
  const [destinationChain, setDestinationChain] = useState<Chain>(chains[1]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [refuelAmount, setRefuelAmount] = useState<string>('0.01');

  // Set initial selected token when tokens are loaded
  useEffect(() => {
    if (tokens.length > 0 && !selectedToken) {
      const chainTokens = getTokensByChain(sourceChain.id);
      if (chainTokens.length > 0) {
        setSelectedToken(chainTokens[0]);
      }
    }
  }, [tokens, sourceChain.id, selectedToken, getTokensByChain]);

  // Auto-switch to best gas token when chain changes
  useEffect(() => {
    if (tokens.length > 0) {
      const chainTokens = getTokensByChain(sourceChain.id);
      const bestGasTokenSymbol = getBestGasToken(sourceChain.id);
      
      // Find the best gas token for this chain
      const bestGasToken = chainTokens.find(token => 
        token.symbol === bestGasTokenSymbol && token.isNative
      );
      
      if (bestGasToken) {
        setSelectedToken(bestGasToken);
      } else if (chainTokens.length > 0) {
        // Fallback to first available token
        setSelectedToken(chainTokens[0]);
      }
    }
  }, [sourceChain.id, tokens, getTokensByChain]);
  const [isRefueling, setIsRefueling] = useState(false);
  const [refuelStatus, setRefuelStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [estimatedFee, setEstimatedFee] = useState<string>('0');
  const [refuelHistory, setRefuelHistory] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isValidAmount, setIsValidAmount] = useState(true);
  const [amountError, setAmountError] = useState('');
  const [showFeeEstimate, setShowFeeEstimate] = useState(false);
  const [chainError, setChainError] = useState('');
  const [refuelError, setRefuelError] = useState('');

  // Get unified balances using Nexus SDK
  const { getTokenBalance } = useTokenBalances({
    address: connectedAddress as `0x${string}`,
    chainId: sourceChain.id,
    tokens: tokens, // Pass all tokens, let the hook filter by chain
  });

  const handleRefuel = async () => {
    if (!isWalletConnected) {
      open();
      return;
    }

    if (!isValidAmount) {
      return;
    }

    // Additional validation before bridge
    if (sourceChain.id === destinationChain.id) {
      const errorMessage = 'Source and destination chains must be different';
      console.error(errorMessage);
      setRefuelError(errorMessage);
      setRefuelStatus('error');
      return;
    }

    // Check if wallet is on the correct source chain
    // const currentChainId = window.ethereum?.chainId ? parseInt(window.ethereum.chainId as string, 16) : null;
    // console.log('Wallet Chain Check:', {
    //   walletChainId: currentChainId,
    //   selectedSourceChain: sourceChain.id,
    //   sourceChainName: sourceChain.name,
    //   isCorrectChain: currentChainId === sourceChain.id
    // });
    
    // if (currentChainId && currentChainId !== sourceChain.id) {
    //   const errorMessage = `Please switch your wallet to ${sourceChain.name} to continue`;
    //   console.error(`Wallet is on chain ${currentChainId}, but source chain is ${sourceChain.id}. ${errorMessage}`);
    //   setChainError(errorMessage);
    //   setRefuelStatus('error');
    //   return;
    // }

    if (!sdk || !isSdkInitialized) {
      const errorMessage = 'Nexus SDK not initialized. Please try again.';
      console.error(errorMessage);
      setRefuelError(errorMessage);
      setRefuelStatus('error');
      return;
    }

    if (!selectedToken) {
      const errorMessage = 'Please select a token to refuel with';
      console.error(errorMessage);
      setRefuelError(errorMessage);
      setRefuelStatus('error');
      return;
    }

    setIsRefueling(true);
    setRefuelStatus('processing');
    setRefuelError(''); // Clear any previous error

    try {
      console.log('Starting bridge transaction...', {
        token: selectedToken.symbol,
        amount: refuelAmount,
        destinationChain: destinationChain.id,
        sourceChain: sourceChain.id
      });

      console.log('Bridge Chain Details:', {
        from: {
          id: sourceChain.id,
          name: sourceChain.name,
          symbol: sourceChain.nativeCurrency.symbol
        },
        to: {
          id: destinationChain.id,
          name: destinationChain.name,
          symbol: destinationChain.nativeCurrency.symbol
        },
        token: {
          symbol: selectedToken.symbol,
          amount: refuelAmount
        }
      });

      // Prepare bridge parameters
      const bridgeParams: BridgeParams = {
        token: selectedToken.symbol as any, // Cast to SUPPORTED_TOKENS
        amount: parseFloat(refuelAmount),
        chainId: destinationChain.id as any, // Cast to SUPPORTED_CHAINS_IDS - Use destination chain for refueling
      };

      console.log('Bridge parameters:', bridgeParams);
      
      console.log('Detailed Bridge Parameters:', {
        token: {
          symbol: selectedToken.symbol,
          type: typeof selectedToken.symbol,
          castTo: 'SUPPORTED_TOKENS'
        },
        amount: {
          value: parseFloat(refuelAmount),
          original: refuelAmount,
          type: typeof parseFloat(refuelAmount)
        },
        chainId: {
          value: destinationChain.id,
          chainName: destinationChain.name,
          type: typeof destinationChain.id,
          castTo: 'SUPPORTED_CHAINS_IDS'
        },
        rawParams: bridgeParams
      });

      // Execute bridge transaction
      const result: BridgeResult = await sdk.bridge(bridgeParams);
      
      console.log('Bridge result:', result);

      if (result.success) {
        // Use explorerUrl as the transaction identifier since Nexus SDK doesn't return transactionHash
        const txIdentifier = result.explorerUrl || 'Bridge completed';
        setTxHash(txIdentifier);
        setRefuelStatus('success');
        
        // Add to refuel history
        const newRefuel = {
          id: Date.now(),
          sourceChain: sourceChain.name,
          destinationChain: destinationChain.name,
          amount: refuelAmount,
          txHash: txIdentifier,
          timestamp: new Date().toISOString(),
          status: 'completed',
          explorerUrl: result.explorerUrl
        };
        setRefuelHistory(prev => [newRefuel, ...prev]);
        
        if (onRefuelComplete) {
          onRefuelComplete(txIdentifier);
        }
      } else {
        throw new Error(result.error || 'Bridge transaction failed');
      }
    } catch (error) {
      console.error('Bridge failed:', error);
      let errorMessage = 'Transaction failed. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds for this transaction';
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transaction was cancelled by user';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection';
        } else if (error.message.includes('gas')) {
          errorMessage = 'Gas estimation failed. Please try again';
        } else {
          errorMessage = error.message;
        }
      }
      
      setRefuelError(errorMessage);
      setRefuelStatus('error');
    } finally {
      setIsRefueling(false);
    }
  };

  // Simulate bridge transaction for cost preview
  const simulateBridge = async () => {
    if (!sdk || !isSdkInitialized || !selectedToken) {
      return;
    }

    try {
      const simulationParams: BridgeParams = {
        token: selectedToken.symbol as any,
        amount: parseFloat(refuelAmount),
        chainId: destinationChain.id as any, // Use destination chain for simulation
      };

      console.log('Simulation Parameters:', {
        token: {
          symbol: selectedToken.symbol,
          type: typeof selectedToken.symbol
        },
        amount: {
          value: parseFloat(refuelAmount),
          original: refuelAmount,
          type: typeof parseFloat(refuelAmount)
        },
        chainId: {
          value: destinationChain.id,
          chainName: destinationChain.name,
          type: typeof destinationChain.id
        },
        rawParams: simulationParams
      });

      const simulation: SimulationResult = await sdk.simulateBridge(simulationParams);
      console.log('Bridge simulation result:', simulation);
      
      // Update estimated fee based on simulation
      if (simulation && simulation.intent && simulation.intent.fees) {
        const totalFee = simulation.intent.fees.total;
        setEstimatedFee(totalFee);
      } else {
        setEstimatedFee('0');
      }
    } catch (error) {
      console.error('Bridge simulation failed:', error);
    }
  };

  // Run bridge simulation when parameters change
  useEffect(() => {
    if (sdk && isSdkInitialized && selectedToken && refuelAmount && isValidAmount) {
      simulateBridge();
    }
  }, [sdk, isSdkInitialized, selectedToken, refuelAmount, destinationChain.id, isValidAmount]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refreshing balances
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleQuickRefuel = (amount: string) => {
    setRefuelAmount(amount);
    validateAmount(amount);
  };

  const validateAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setIsValidAmount(false);
      setAmountError('Please enter a valid amount');
      return false;
    }
    
    // Check if source and destination chains are different
    if (sourceChain.id === destinationChain.id) {
      setIsValidAmount(false);
      setAmountError('Source and destination chains must be different');
      return false;
    }
    
    // Check if user has enough balance for the refuel amount
    // const selectedTokenBalance = selectedToken ? getTokenBalance(selectedToken) : null;
    // if (selectedTokenBalance && numAmount > parseFloat(selectedTokenBalance.formatted)) {
    //   setIsValidAmount(false);
    //   setAmountError('Amount exceeds your balance');
    //   return false;
    // }
    setIsValidAmount(true);
    setAmountError('');
    return true;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRefuelAmount(value);
    validateAmount(value);
  };

  // Clear chain error when source chain changes
  useEffect(() => {
    setChainError('');
  }, [sourceChain.id]);

  // Log chain selection details
  useEffect(() => {
    console.log('Chain Selection Details:', {
      from: {
        id: sourceChain.id,
        name: sourceChain.name,
        symbol: sourceChain.nativeCurrency.symbol,
        chainId: sourceChain.id
      },
      to: {
        id: destinationChain.id,
        name: destinationChain.name,
        symbol: destinationChain.nativeCurrency.symbol,
        chainId: destinationChain.id
      }
    });
  }, [sourceChain, destinationChain]);

  const getStatusIcon = () => {
    switch (refuelStatus) {
      case 'processing':
        return <Loader className="h-5 w-5 animate-spin text-blue-400" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Fuel className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (refuelStatus) {
      case 'processing':
        return 'Processing refuel...';
      case 'success':
        return 'Refuel completed!';
      case 'error':
        return 'Refuel failed';
      default:
        return 'Ready to refuel';
    }
  };

  return (
    <div className="min-h-screen py-8 relative bg-black overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.05)_0%,transparent_50%)]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fadeIn">
          <div className="inline-flex items-center px-6 py-3 bg-black/20 backdrop-blur-2xl border border-white/20 rounded-full text-gray-200 text-sm font-bold mb-6 shadow-2xl hover:shadow-3xl transition-all duration-500 group ring-1 ring-white/10 hover:ring-white/20">
            <span className="group-hover:text-white transition-all duration-500 tracking-wider uppercase bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-blue-100 group-hover:to-white">Cross-Chain • Gas Refuel</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent animate-fadeIn" style={{animationDelay: '0.2s'}}>
            {/* Gas Refuel */}
          </h1>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4 animate-fadeIn" style={{animationDelay: '0.4s'}}>
            {/* Refuel any chain with any token using cross-chain technology */}
          </p>
        </div>

        {/* Refuel Interface */}
        <div className="max-w-4xl mx-auto animate-fadeIn" style={{animationDelay: '0.6s'}}>
          <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 group">
            {/* Enhanced background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.03)_0%,transparent_50%)]"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10 space-y-6 sm:space-y-8">
            {/* Chain Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="relative">
                <label className="block text-sm sm:text-base font-semibold text-gray-200 mb-2 sm:mb-3">
                  From
                </label>
                <div className="relative">
                  <div className="pointer-events-none">
                    <ChainSelector
                      chains={chains}
                      selectedChain={sourceChain}
                      onChainSelect={() => {}} // Disabled
                      balance={getTokenBalance({ symbol: sourceChain.nativeCurrency.symbol, chainId: sourceChain.id, isNative: true } as Token)}
                    />
                  </div>
                  {/* Coming Soon Overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl pointer-events-none"></div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-xl border border-orange-500/30 rounded-xl px-4 py-2 shadow-2xl">
                      <span className="text-orange-300 font-semibold text-sm flex items-center">
                        <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></span>
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-orange-300 flex items-center bg-black/40 backdrop-blur-xl border border-orange-500/30 rounded-lg px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-black/50 hover:border-orange-500/40">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2 animate-pulse"></span>
                  <span className="font-medium">Manual source chain selection will be available soon</span>
                </p>
              </div>
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-200 mb-2 sm:mb-3">To</label>
                <ChainSelector
                  chains={chains.filter(chain => chain.id !== sourceChain.id)}
                  selectedChain={destinationChain}
                  onChainSelect={setDestinationChain}
                  balance={getTokenBalance({ symbol: destinationChain.nativeCurrency.symbol, chainId: destinationChain.id, isNative: true } as Token)}
                />
              </div>
            </div>

            {/* Token Selection */}
            <div className="relative">
              <label className="block text-sm sm:text-base font-semibold text-gray-200 mb-2 sm:mb-3">Token to Use</label>
              <div className="relative">
                <div className="pointer-events-none">
                  <TokenSelector
                    tokens={getTokensByChain(sourceChain.id)}
                    selectedToken={selectedToken}
                    onTokenSelect={() => {}} // Disabled
                    balance={selectedToken ? getTokenBalance(selectedToken) : undefined}
                    getTokenBalance={getTokenBalance}
                  />
                </div>
                {/* Coming Soon Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl pointer-events-none"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-xl border border-orange-500/30 rounded-xl px-4 py-2 shadow-2xl">
                    <span className="text-orange-300 font-semibold text-sm flex items-center">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></span>
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-200 mb-2 sm:mb-3">Amount</label>
              <div className="relative group">
                <input
                  type="number"
                  value={refuelAmount}
                  onChange={handleAmountChange}
                  placeholder="0.01"
                  step="0.001"
                  min="0"
                  className={`w-full px-4 sm:px-5 py-3 sm:py-4 bg-black/20 backdrop-blur-xl border rounded-xl text-gray-100 placeholder-gray-400 transition-all duration-300 hover:border-white/25 text-base sm:text-lg group-hover:bg-black/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    isValidAmount 
                      ? 'border-white/15 focus:border-white/30 focus:outline-none' 
                      : 'border-red-500/50 focus:border-red-500 focus:outline-none'
                  }`}
                />
                <div className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base font-medium group-hover:text-gray-300 transition-colors duration-300">
                  {selectedToken?.symbol || 'Token'}
                </div>
              </div>
              {!isValidAmount && amountError && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {amountError}
                </p>
              )}
              {isValidAmount && refuelAmount && (
                <div className="mt-2 text-sm text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Estimated fee: {estimatedFee} {sourceChain.nativeCurrency.symbol}</span>
                    <button
                      onClick={() => setShowFeeEstimate(!showFeeEstimate)}
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                    >
                      {showFeeEstimate ? 'Hide' : 'Show'} details
                    </button>
                  </div>
                  {showFeeEstimate && (
                    <div className="mt-2 p-3 bg-black/20 border border-white/10 rounded-lg">
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Refuel amount:</span>
                          <span>{refuelAmount} {destinationChain.nativeCurrency.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Network fee:</span>
                          <span>{estimatedFee} {sourceChain.nativeCurrency.symbol}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-gray-200">
                          <span>Total cost:</span>
                          <span>{(parseFloat(estimatedFee)).toFixed(4)} {sourceChain.nativeCurrency.symbol}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Amounts */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-200 mb-3">Quick Amounts</label>
              <div className="flex gap-2">
                {['0.005', '0.01', '0.02', '0.05'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickRefuel(amount)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-all duration-300 ${
                      refuelAmount === amount
                        ? 'bg-white/10 border-white/30 text-white'
                        : 'bg-black/20 border-white/15 text-gray-300 hover:border-white/25 hover:bg-white/5'
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Status - Only show for error state */}
            {refuelStatus === 'error' && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <span className="text-red-300 text-sm">
                    {refuelError || chainError || 'Transaction failed'}
                  </span>
                </div>
              </div>
            )}

            {/* Refuel Button */}
            <button
              onClick={handleRefuel}
              disabled={isRefueling || !isWalletConnected || !isValidAmount || !refuelAmount}
              className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-black/40 backdrop-blur-2xl border border-white/20 text-white hover:bg-black/60 hover:border-white/30 focus:ring-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-xl font-semibold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-white/10 hover:scale-[1.02] active:scale-[0.98] group"
            >
              {isRefueling ? (
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  <span className="text-sm sm:text-base">Refueling...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <Fuel className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-sm sm:text-base">
                    {!isWalletConnected 
                      ? 'Connect Wallet to Refuel' 
                      : !isValidAmount 
                        ? 'Fix Amount to Continue'
                        : `Refuel ${refuelAmount} ${destinationChain.nativeCurrency.symbol}`
                    }
                  </span>
                </div>
              )}
            </button>
            </div>
          </div>
        </div>

        {/* Success Message - Black glassy modal */}
        {refuelStatus === 'success' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <div className="bg-black/40 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl ring-1 ring-white/5 max-w-md w-full animate-fadeIn">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Refuel Successful!</h3>
                <p className="text-gray-300 text-sm mb-6">Your gas has been successfully refueled on the destination chain.</p>
                <button
                  onClick={() => setRefuelStatus('idle')}
                  className="w-full py-3 px-6 bg-black/40 backdrop-blur-2xl border border-white/20 text-white rounded-xl hover:bg-black/60 hover:border-white/30 transition-all duration-300"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
