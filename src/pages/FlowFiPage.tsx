import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowRight, Zap, Shield, DollarSign, Clock, Target, Wallet } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useNexus } from '@avail-project/nexus-widgets';
import { useAccount } from 'wagmi';
import { useAppKitAccount } from '@reown/appkit/react';

interface FlowFiPageProps {
  onNavigateBack?: () => void;
}

export function FlowFiPage({ onNavigateBack }: FlowFiPageProps) {
  const { sdk, isSdkInitialized } = useNexus();
  const { address } = useAccount();
  const { address: appKitAddress } = useAppKitAccount();
  
  const connectedAddress = appKitAddress || address;
  
  const [selectedStable, setSelectedStable] = useState('USDC');
  const [selectedProtocol, setSelectedProtocol] = useState('');
  const [amount, setAmount] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [balances, setBalances] = useState({
    USDC: '0',
    USDT: '0',
    ETH: '0'
  });
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  // Fetch unified balances from Nexus SDK
  useEffect(() => {
    const fetchUnifiedBalances = async () => {
      if (!sdk || !isSdkInitialized || !connectedAddress) {
        return;
      }

      setIsLoadingBalances(true);
      
      try {
        // Get all unified balances from Nexus
        const allBalances = await sdk.getUnifiedBalances();
        
        // Convert to our format - aggregate balances across all chains
        const aggregatedBalances: Record<string, number> = {};
        
        allBalances.forEach((asset) => {
          const { symbol, balance } = asset;
          
          // Aggregate balance across all chains for each token
          if (!aggregatedBalances[symbol]) {
            aggregatedBalances[symbol] = 0;
          }
          aggregatedBalances[symbol] += parseFloat(balance);
        });

        // Update balances state
        setBalances({
          USDC: aggregatedBalances.USDC?.toFixed(2) || '0',
          USDT: aggregatedBalances.USDT?.toFixed(2) || '0',
          ETH: aggregatedBalances.ETH?.toFixed(4) || '0'
        });
        
        console.log('Unified balances fetched:', aggregatedBalances);
      } catch (error) {
        console.error('Error fetching unified balances:', error);
        setBalances({ USDC: '0', USDT: '0', ETH: '0' });
      } finally {
        setIsLoadingBalances(false);
      }
    };

    fetchUnifiedBalances();
  }, [sdk, isSdkInitialized, connectedAddress]);

  const stablecoins = [
    { symbol: 'USDC', name: 'USD', platform: 'Aave', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png' },
    { symbol: 'USDT', name: 'Tether USD', platform: 'Morpho', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png' },
    { symbol: 'ETH', name: 'Ethereum', platform: 'Compound', logo: 'https://etherscan.io/images/svg/brands/ethereum-original.svg' }
  ];

  const yieldPlatforms = [
    { name: 'Aave', apy: '3.06%', chain: 'Ethereum', tvl: '', logo: '/aave.jpg' },
    { name: 'Morpho', apy: '7.97%', chain: 'Arbitrum', tvl: '', logo: '/morpho.jpg' },
    { name: 'Compound', apy: '3.40%', chain: 'Polygon', tvl: '', logo: 'https://compound.finance/compound-components/assets/compound-mark.svg' },
    { name: 'Euler', apy: '5.06%', chain: 'Ethereum', tvl: '', logo: '/euler.jpg' }
  ];

  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [autoRebalance, setAutoRebalance] = useState(true);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    // Simulate optimization process
    setTimeout(() => {
      setIsOptimizing(false);
      setShowSuccess(true);
      setOptimizationResult({
        from: selectedStable,
        to: selectedProtocol,
        amount: amount,
        estimatedYield: '9.1%'
      });
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black py-20 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-gray-800/10 to-gray-700/10 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-gray-700/10 to-gray-600/10 rounded-full blur-xl translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-br from-gray-800/8 to-gray-700/8 rounded-full blur-lg -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-black/20 backdrop-blur-2xl border border-white/20 rounded-full text-gray-200 text-sm font-bold mb-6 shadow-2xl hover:shadow-3xl transition-all duration-500 group ring-1 ring-white/10 hover:ring-white/20">
            <span className="group-hover:text-white transition-all duration-500 tracking-wider uppercase bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-blue-100 group-hover:to-white">Auto Yield Optimization</span>
          </div>
      
          <h1 className="text-2xl font-bold mb-4 text-white">
            Maximize Your Stablecoin Returns
          </h1>
          
          <p className="text-base text-gray-300 max-w-xl mx-auto">
            Automatically move your USDC, USDT, and DAI to the highest-yielding protocols across multiple chains.
          </p>
        </div>

        {/* Main Flow */}
        <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 mb-16">
          {/* Subtle background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(34,197,94,0.05)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">Configure Your Optimization</h2>
              <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                Select your asset, choose a target protocol, and let our AI optimize your yield automatically
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 items-start relative">
              {/* Connecting Line */}
              <div className="hidden lg:block absolute top-4 left-1/2 w-0.5 h-16 bg-gradient-to-b from-blue-500/30 to-green-500/30 transform -translate-x-1/2"></div>
              
              {/* Left: Asset Selection */}
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <span className="text-blue-400 font-bold text-sm">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Choose Asset</h3>
                </div>
                
                <div className="bg-black/20 backdrop-blur-xl border border-white/15 rounded-2xl p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* Token Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">Select Token</label>
                      <div className="grid grid-cols-3 gap-3">
                        {stablecoins.map((stable) => (
                          <button
                            key={stable.symbol}
                            onClick={() => setSelectedStable(stable.symbol)}
                            className={`p-3 rounded-2xl border transition-all duration-300 ${
                              selectedStable === stable.symbol
                                ? 'border-white/30 bg-white/10 text-white'
                                : 'border-white/15 bg-black/20 backdrop-blur-xl text-gray-300 hover:border-white/25'
                            }`}
                          >
                            <div className="text-center">
                              {stable.logo && (
                                <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                                  <img 
                                    src={stable.logo} 
                                    alt={`${stable.name} logo`}
                                    className="w-6 h-6 object-contain"
                                  />
                                </div>
                              )}
                              <div className="font-bold text-base">{stable.symbol}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">Amount to Optimize</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          min="0"
                          step="0.0001"
                          className="w-full px-4 py-3 bg-black/20 backdrop-blur-xl border border-white/15 rounded-xl text-white placeholder-gray-400 focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          {selectedStable}
                        </div>
                      </div>
                      {amount && parseFloat(amount) > 0 && (
                        <div className="mt-2 text-xs text-gray-400">
                          Estimated yield: {selectedProtocol ? yieldPlatforms.find(p => p.name === selectedProtocol)?.apy || '9.1%' : 'Select protocol'}
                        </div>
                      )}
                    </div>
                    
                    {/* Token Balances Display */}
                    <div className="bg-black/5 backdrop-blur-none border border-white/5 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Wallet className="w-4 h-4 text-blue-400/30" />
                          <div className="text-sm text-gray-700">
                            {isLoadingBalances ? 'Loading balances...' : 'Unified Balances:'}
                          </div>
                        </div>
                        {isLoadingBalances ? (
                          <div className="text-sm text-gray-500">Fetching from Nexus...</div>
                        ) : (
                          <div className="flex justify-between w-full max-w-xs text-sm">
                            <div className="text-gray-500">{balances.USDC} USDC</div>
                            <div className="text-gray-500">{balances.USDT} USDT</div>
                            <div className="text-gray-500">{balances.ETH} ETH</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Auto Rebalance */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between p-3 bg-black/20 backdrop-blur-xl rounded-lg border border-white/15">
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">Auto Rebalance</div>
                        <div className="text-xs text-gray-400">Every 7 days</div>
                      </div>
                      <button
                        onClick={() => setAutoRebalance(!autoRebalance)}
                        className={`w-10 h-5 rounded-full relative transition-all duration-300 flex-shrink-0 flex items-center ${
                          autoRebalance 
                            ? 'bg-white/30 border border-white/50' 
                            : 'bg-white/20 border border-white/30'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                          autoRebalance ? 'ml-5' : 'ml-0.5'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Protocol Selection */}
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <span className="text-green-400 font-bold text-sm">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Select Target Protocol</h3>
                </div>
                
                <div className="bg-black/20 backdrop-blur-xl border border-white/15 rounded-2xl p-6 flex-1 flex flex-col">
                  <div className="grid gap-3 flex-1">
                  {yieldPlatforms.map((platform, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedProtocol(platform.name)}
                      className={`p-4 bg-black/20 backdrop-blur-xl border rounded-2xl transition-all duration-300 group shadow-lg hover:shadow-xl text-left w-full ${
                        selectedProtocol === platform.name
                          ? 'border-white/30 bg-white/10'
                          : 'border-white/15 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-lg flex items-center justify-center overflow-hidden">
                            {platform.logo ? (
                              <img 
                                src={platform.logo} 
                                alt={`${platform.name} logo`}
                                className={platform.name === 'Compound' ? "w-6 h-6 object-contain" : "w-full h-full object-cover"}
                              />
                            ) : (
                              <span className="text-white font-bold text-xs">{platform.name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">{platform.name}</div>
                            <div className="text-xs text-gray-400">{platform.chain}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold text-sm">{platform.apy}</div>
                          {/* <div className="text-xs text-gray-400">TVL: {platform.tvl}</div> */}
                        </div>
                      </div>
                    </button>
                  ))}
                  </div>

                  <div className="mt-6 p-4 bg-white/10 border border-white/30 rounded-xl">
                    <div className="flex items-center text-white font-medium mb-2">
                      <Target className="h-4 w-4 mr-2" />
                      Recommended Strategy
                    </div>
                    <div className="text-sm text-gray-300">
                      Move {amount || 'your'} {selectedStable} to {selectedProtocol || 'Compound'} for optimal yield
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Centered Move Now Button */}
            <div className="flex justify-center mt-12">
              <button
                onClick={handleOptimize}
                disabled={!amount || isOptimizing || !selectedProtocol}
                className="px-10 py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-2xl border border-white/30 text-white hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:text-white font-semibold text-base rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl disabled:hover:scale-100"
              >
                {isOptimizing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Optimizing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Zap className="h-6 w-6 mr-2" />
                    Move Now
                  </div>
                )}
              </button>
            </div>

            {/* Success Notification */}
            {showSuccess && optimizationResult && (
              <div className="fixed top-4 right-4 z-50 bg-green-500/10 backdrop-blur-xl border border-green-500/30 rounded-xl p-4 shadow-2xl animate-slideInRight">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-green-300 font-semibold text-sm">Optimization Complete!</div>
                    <div className="text-green-400 text-xs">
                      Moved {optimizationResult.amount} {optimizationResult.from} to {optimizationResult.to} 
                      for {optimizationResult.estimatedYield} APY
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 text-center shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <DollarSign className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Maximize Returns</h3>
              <p className="text-gray-400 text-sm">
                Automatically chase the highest yields across all supported chains
              </p>
            </div>
          </div>
          
          <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 text-center shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <Clock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Auto Rebalancing</h3>
              <p className="text-gray-400 text-sm">
                Every 7 days, AI agent rebalances to maintain optimal yield
              </p>
            </div>
          </div>
          
          <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 text-center shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Secure & Trusted</h3>
              <p className="text-gray-400 text-sm">
                Battle-tested protocols with audited smart contracts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
