import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { Button } from '../components/ui/Button';
import { ArrowRight, Fuel, Zap, Globe, TrendingUp, Info, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
  onNavigateToFlowFi?: () => void;
  onNavigateToPerpPort?: () => void;
}

export function HomePage({ onGetStarted, onNavigateToFlowFi, onNavigateToPerpPort }: HomePageProps) {
  const features = [
    {
      icon: Globe,
      title: 'Multi-DEX Trading',
      description: 'Trade perpetuals on Hyperliquid, Aster, Reya, and more — all from one unified interface.'
    },
    {
      icon: Zap,
      title: 'Nexus Bridge & Execute',
      description: 'Bridge and execute trades across any chain with one click, powered by Avail Nexus SDK.'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Data',
      description: 'Live funding rates, liquidity, and market data across all perpetual DEXes.'
    }
  ];

  return (
    <div className="space-y-16">
      <HeroSection />
      
      {/* Problem & Solution Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5">
          {/* Subtle background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
          
          {/* Perpetual DEX Logos in Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Hyperliquid */}
            <img 
              src="https://hyperliquid.gitbook.io/hyperliquid-docs/~gitbook/image?url=https%3A%2F%2F2356094849-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FyUdp569E6w18GdfqlGvJ%252Ficon%252FsIAjqhKKIUysM08ahKPh%252FHL-logoSwitchDISliStat.png%3Falt%3Dmedia%26token%3Da81fa25c-0510-4d97-87ff-3fb8944935b1&width=32&dpr=4&quality=100&sign=3e1219e3&sv=2" 
              alt="Hyperliquid" 
              className="absolute top-10 left-10 w-12 h-12 opacity-20 rotate-12 drop-shadow-lg shadow-blue-500/30"
            />
            
            {/* Aster */}
            <img 
              src="https://s2.coinmarketcap.com/static/img/coins/64x64/36341.png" 
              alt="Aster" 
              className="absolute top-20 right-20 w-10 h-10 opacity-20 -rotate-12 drop-shadow-lg shadow-purple-500/30"
            />
            
            {/* Lighter */}
            <img 
              src="https://framerusercontent.com/images/k22lnUP5Ao1xIheAoknaPGmdjXk.svg?width=14&height=26" 
              alt="Lighter" 
              className="absolute top-32 left-1/4 w-8 h-8 opacity-20 rotate-6 drop-shadow-lg shadow-green-500/30"
            />
            
            {/* Reya */}
            <img 
              src="https://cdn.prod.website-files.com/66b5e4e47712e879f0c5ef1b/686bcf104a9c1d2d2c69c5da_r.svg" 
              alt="Reya" 
              className="absolute bottom-20 left-16 w-10 h-10 opacity-20 -rotate-6 drop-shadow-lg shadow-indigo-500/30"
            />
            
            
            <img 
              src="https://pbs.twimg.com/profile_images/1912020809238888448/1veICPNZ_400x400.jpg" 
              alt="dYdX" 
              className="absolute top-1/2 left-8 w-6 h-6 opacity-20 -rotate-3 rounded-lg drop-shadow-lg shadow-gray-500/30"
            />
            
            {/* GMX */}
            <img 
              src="https://pbs.twimg.com/profile_images/1944981944208379904/rq7BqkDo_400x400.png" 
              alt="GMX" 
              className="absolute bottom-10 right-10 w-8 h-8 opacity-20 rotate-9 rounded-lg drop-shadow-lg shadow-yellow-500/30"
            />
            
            <div className="absolute top-1/3 right-8 w-8 h-8 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-lg flex items-center justify-center -rotate-9 drop-shadow-lg shadow-indigo-500/30">
              <img 
                src="https://pbs.twimg.com/profile_images/1876581196173320192/pF4KQQCb_400x400.jpg" 
                alt="GMX" 
                className="w-6 h-6 opacity-20 rotate-9 rounded-lg"
              />
            </div>
          </div>
          
          <div className="relative z-10 text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-red-500/10 backdrop-blur-2xl border border-red-500/20 rounded-full text-red-300 text-sm font-medium mb-6 shadow-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              The Challenge
            </div>
            <h2 className="text-2xl font-bold text-gray-100 mb-6">
              Blockchain Fragmentation in Derivatives Markets
            </h2>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto font-medium">
              Traders face significant barriers when trying to access the best perpetual trading opportunities across different blockchains and DEXs.
            </p>
          </div>

          <div className="relative z-10">
            {/* Problem vs Solution Comparison */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Problem Side */}
              <div className="space-y-4 animate-fadeIn" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-red-400">What's Broken</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 bg-red-500/5 border border-red-500/20 rounded-lg hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 group animate-fadeIn" style={{animationDelay: '0.4s'}}>
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-red-100 transition-colors duration-300">Capital Inefficiency</h4>
                      <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                        Assets scattered across chains, manual bridging required
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 bg-red-500/5 border border-red-500/20 rounded-lg hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 group animate-fadeIn" style={{animationDelay: '0.6s'}}>
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-red-100 transition-colors duration-300">Operational Complexity</h4>
                      <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                        Multiple wallet connections, chain switching friction
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 bg-red-500/5 border border-red-500/20 rounded-lg hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 group animate-fadeIn" style={{animationDelay: '0.8s'}}>
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-red-100 transition-colors duration-300">Market Inefficiency</h4>
                      <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                        Missed arbitrage opportunities, fragmented access
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solution Side */}
              <div className="space-y-4 animate-fadeIn" style={{animationDelay: '1s'}}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50 animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-green-400">How We Fix It</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 bg-green-500/5 border border-green-500/20 rounded-lg hover:bg-green-500/10 hover:border-green-500/30 transition-all duration-300 group animate-fadeIn" style={{animationDelay: '1.2s'}}>
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-green-100 transition-colors duration-300">Unified Access</h4>
                      <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                        One-click deposits to any DEX from any chain
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 bg-green-500/5 border border-green-500/20 rounded-lg hover:bg-green-500/10 hover:border-green-500/30 transition-all duration-300 group animate-fadeIn" style={{animationDelay: '1.4s'}}>
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-green-100 transition-colors duration-300">Optimized Routing</h4>
                      <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                        Automated gas optimization, minimal costs
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 bg-green-500/5 border border-green-500/20 rounded-lg hover:bg-green-500/10 hover:border-green-500/30 transition-all duration-300 group animate-fadeIn" style={{animationDelay: '1.6s'}}>
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-green-100 transition-colors duration-300">Real-Time Intelligence</h4>
                      <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                        Live funding rate comparison across DEXs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Flow Arrow */}
            <div className="flex justify-center mb-8 animate-fadeIn" style={{animationDelay: '1.8s'}}>
              <div className="flex items-center space-x-2 px-4 py-2 bg-black/30 backdrop-blur-xl border border-white/20 rounded-full hover:bg-black/40 hover:border-white/30 transition-all duration-500 group">
                <div className="w-2 h-2 bg-red-400 rounded-full group-hover:animate-ping"></div>
                <div className="w-8 h-px bg-gradient-to-r from-red-400 via-gray-400 to-green-400 group-hover:from-red-500 group-hover:via-gray-300 group-hover:to-green-500 transition-all duration-500"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full group-hover:animate-ping" style={{animationDelay: '0.5s'}}></div>
                <span className="text-xs text-gray-400 ml-2 group-hover:text-white transition-colors duration-300">NexusFinance</span>
              </div>
            </div>
          </div>

          {/* <div className="relative z-10 text-center mt-12">
            <div className="inline-flex items-center px-6 py-3 bg-black/20 backdrop-blur-2xl border border-white/15 rounded-full text-white text-sm font-semibold shadow-xl hover:shadow-2xl transition-all duration-500">
              <Zap className="w-4 h-4 mr-2" />
              The Solution: 
            </div>
          </div> */}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl py-16 px-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-full text-gray-300 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              How PerpPort Works
            </div>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">
                  {/* How It Works */}
                </h2>
                <p className="text-sm text-gray-300 max-w-2xl mx-auto font-medium">
                  {/* Three simple steps to trade perpetuals on any DEX with cross-chain deposits */}
                </p>
          </div>

          <div className="relative z-10 grid md:grid-cols-3 gap-10 mb-16">
            <div className="text-center relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-3xl hover:border-white/25 transition-all duration-500 group hover:scale-105 animate-fadeIn overflow-hidden ring-1 ring-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-xl">
                  <span className="text-3xl font-bold text-blue-400 group-hover:text-white transition-colors duration-300">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-4 group-hover:text-white transition-colors duration-300">Select Your DEX</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Choose from Hyperliquid, Aster, Reya, or other perpetual DEXes
                </p>
              </div>
            </div>
          
            <div className="text-center relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-3xl hover:border-white/25 transition-all duration-500 group hover:scale-105 animate-fadeIn overflow-hidden ring-1 ring-white/5" style={{animationDelay: '0.2s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-xl">
                  <span className="text-3xl font-bold text-green-400 group-hover:text-white transition-colors duration-300">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-4 group-hover:text-white transition-colors duration-300">Choose Your Token</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Select ETH, USDC, USDT and specify the amount to deposit.
                </p>
                <div className="mt-3 flex items-center justify-center space-x-1">
                  <Info className="w-3 h-3 text-gray-600 opacity-50" />
                  <span className="text-gray-600 text-xs opacity-50">Nexus SDK automatically bridges your tokens</span>
                </div>
              </div>
            </div>
          
            <div className="text-center relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-3xl hover:border-white/25 transition-all duration-500 group hover:scale-105 animate-fadeIn overflow-hidden ring-1 ring-white/5" style={{animationDelay: '0.4s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-xl">
                  <span className="text-3xl font-bold text-purple-400 group-hover:text-white transition-colors duration-300">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-4 group-hover:text-white transition-colors duration-300">Trade</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Open long/short positions on your chosen DEX in one place.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-center">
            <Button onClick={onGetStarted} size="md" variant="outline" className="px-12 py-3 bg-black/20 backdrop-blur-2xl border border-white/15 text-gray-200 hover:bg-black/30 hover:text-white hover:border-white/25 hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-3xl group ring-1 ring-white/5 hover:ring-white/10">
              <span className="flex items-center text-base font-bold tracking-wide">
                Get Started
                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform duration-500" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl p-12 shadow-2xl hover:bg-black/30 hover:border-white/25 hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5">
          {/* Subtle background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(147,51,234,0.05)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-full text-gray-300 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
              Key Features
            </div>
            <h2 className="text-2xl font-bold text-gray-100 mb-6">
              {/* Why Choose NexusFinance? */}
            </h2>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
              {/* Revolutionary cross-chain DeFi hub powered by Avail Nexus SDK */}
            </p>
          </div>

          <div className="relative z-10 grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:border-white/25 group hover:scale-105 animate-fadeIn overflow-hidden ring-1 ring-white/5" style={{animationDelay: `${0.6 + index * 0.2}s`}}>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 text-center">
                    <Icon className="h-10 w-10 text-gray-300 group-hover:text-white transition-all duration-500 mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3" />
                    <h3 className="text-lg font-semibold text-gray-100 mb-5 group-hover:text-white transition-colors duration-300">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FlowFi Yield Optimization Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl p-12 shadow-2xl hover:bg-black/30 hover:border-white/25 hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5">
          {/* Subtle background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.02)_0%,transparent_50%)]"></div>
          
          <div className="relative z-10 text-center mb-16">
            <div className="inline-flex items-center px-3 py-1.5 bg-black/20 backdrop-blur-2xl border border-white/15 rounded-full text-gray-200 text-xs font-medium mb-4 shadow-xl">
              {/* <TrendingUp className="h-3 w-3 mr-1.5 text-green-400" /> */}
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              
               Yield Optimization
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {/* Your Stablecoins Always Chasing the Best Yield */}
            </h2>
            <p className="text-base text-gray-300 max-w-2xl mx-auto mb-6">
              {/* Automatically move idle stables to the best yield platforms across chains with a single click. */}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onNavigateToFlowFi}
                className="px-6 py-3 bg-black/60 backdrop-blur-2xl border border-white/15 text-white hover:bg-black/80 hover:border-white/25 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl"
              >
                <span className="flex items-center">
                  {/* <TrendingUp className="h-4 w-4 mr-2" /> */}
                    Yield Optimization 
                  {/* <ArrowRight className="h-4 w-4 ml-2" /> */}
                </span>
              </button>
              
              <button 
                onClick={onGetStarted}
                className="px-6 py-3 bg-black/60 backdrop-blur-2xl border border-white/15 text-white hover:bg-black/80 hover:border-white/25 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl"
              >
                <span className="flex items-center">
                  <Fuel className="h-4 w-4 mr-2" />
                  Gas Refuel
                  {/* <ArrowRight className="h-4 w-4 ml-2" /> */}
                </span>
              </button>
            </div>
          </div>

          <div className="relative z-10 grid md:grid-cols-3 gap-8">
            <div className="text-center bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 shadow-2xl hover:shadow-3xl hover:border-white/30 transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-white/20 border border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Auto Yield Optimization</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                NexusFinance finds the best yield opportunities across Aave, Morpho, Compound on multiple chains
              </p>
            </div>
            
            <div className="text-center bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 shadow-2xl hover:shadow-3xl hover:border-white/30 transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-white/20 border border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Nexus Bridge & Execute</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Bridge and execute moves liquidity to target chain and deposits into best yield pool
              </p>
            </div>
            
            <div className="text-center bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 shadow-2xl hover:shadow-3xl hover:border-white/30 transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-white/20 border border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Auto Rebalancing</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every 7 days, NexusFinance rebalances to maintain optimal yield across all chains
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PerpPort Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl p-12 shadow-2xl hover:bg-black/30 hover:border-white/25 hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5">
          {/* Subtle background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.02)_0%,transparent_50%)]"></div>
          
          <div className="relative z-10 text-center mb-16">
            <div className="inline-flex items-center px-3 py-1.5 bg-black/20 backdrop-blur-2xl border border-white/15 rounded-full text-gray-200 text-xs font-medium mb-4 shadow-xl">
              {/* <Zap className="h-3 w-3 mr-1.5 text-purple-400" /> */}
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              Cross-Chain Perpetual Deposits
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {/* Deposit to Your Favorite Perp DEX — From Any Chain */}
            </h2>
            <p className="text-base text-gray-300 max-w-2xl mx-auto mb-6">
              {/* One-click deposits to Hyperliquid, Aevo, Drift and more. No manual bridging or network switching required. */}
            </p>
          
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onNavigateToPerpPort}
                className="px-6 py-3 bg-black/60 backdrop-blur-2xl border border-white/15 text-white hover:bg-black/80 hover:border-white/25 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl"
              >
                <span className="flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Launch PerpPort
                  {/* <ArrowRight className="h-4 w-4 ml-2" /> */}
                </span>
              </button>
            </div>
        </div>

        <div className="relative z-10 grid md:grid-cols-3 gap-8">
          <div className="text-center bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 shadow-2xl hover:shadow-3xl hover:border-white/30 transition-all duration-500 group">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-white/20 border border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">One-Click Deposits</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bridge and deposit to your favorite perpetual DEX in a single transaction
            </p>
          </div>
          
          <div className="text-center bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 shadow-2xl hover:shadow-3xl hover:border-white/30 transition-all duration-500 group">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-white/20 border border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Multi-DEX Support</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Support for Hyperliquid, Aevo, Drift Protocol and more leading perpetual exchanges
            </p>
          </div>
          
          <div className="text-center bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 shadow-2xl hover:shadow-3xl hover:border-white/30 transition-all duration-500 group">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-white/20 border border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Nexus Bridge & Execute</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bridge and execute deposits from any supported chain without manual bridging or network switching
            </p>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}