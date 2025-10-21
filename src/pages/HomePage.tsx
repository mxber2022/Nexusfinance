import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { Button } from '../components/ui/Button';
import { ArrowRight, Fuel, Zap, Globe, TrendingUp } from 'lucide-react';

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
      title: 'Cross-Chain Native',
      description: 'Bridge USDC from any chain and open positions with one click, powered by Avail Nexus SDK.'
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
              How It Works
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
                  Select ETH, USDC, USDT, or SOL and specify the amount to deposit
                </p>
              </div>
            </div>
          
            <div className="text-center relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-3xl hover:border-white/25 transition-all duration-500 group hover:scale-105 animate-fadeIn overflow-hidden ring-1 ring-white/5" style={{animationDelay: '0.4s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-xl">
                  <span className="text-3xl font-bold text-purple-400 group-hover:text-white transition-colors duration-300">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-4 group-hover:text-white transition-colors duration-300">Bridge & Trade</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Nexus SDK automatically bridges your tokens and opens positions on your chosen DEX
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
                  <div className="relative z-10">
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
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Start NexusFinance
                  <ArrowRight className="h-4 w-4 ml-2" />
                </span>
              </button>
              
              <button 
                onClick={onGetStarted}
                className="px-6 py-3 bg-black/60 backdrop-blur-2xl border border-white/15 text-white hover:bg-black/80 hover:border-white/25 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl"
              >
                <span className="flex items-center">
                  <Fuel className="h-4 w-4 mr-2" />
                  Gas Refuel
                  <ArrowRight className="h-4 w-4 ml-2" />
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
              <h3 className="text-lg font-semibold text-white mb-3">1-Click Cross-Chain</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Bridge & Execute moves liquidity to target chain and deposits into best yield pool
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
                  <ArrowRight className="h-4 w-4 ml-2" />
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
            <h3 className="text-lg font-semibold text-white mb-3">Cross-Chain Native</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Deposit from any supported chain without manual bridging or network switching
            </p>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}