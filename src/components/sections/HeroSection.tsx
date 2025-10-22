import React, { useState, useEffect } from 'react';
import { Fuel, Zap, Globe, Shield, TrendingUp, ArrowRightLeft, BarChart3 } from 'lucide-react';
import { FeatureCard } from '../ui/FeatureCard';
import { Badge } from '../ui/Badge';
import { StatCard } from '../ui/StatCard';

export function HeroSection() {
  const [logoSet, setLogoSet] = useState(0);
  const [centralLogo, setCentralLogo] = useState(0);

  // Define central logo sets
  const centralLogos = [
    {
      src: "/logo3.png",
      alt: "Nexus Finance",
      size: "w-28 h-28"
    },
    {
      src: "https://www.availproject.org/_next/static/media/grow.1113097f.png",
      alt: "Avail",
      size: "w-20 h-20"
    }
  ];

  // Define logo sets
  const logoSets = [
    // DEX logos
    [
      {
        src: "https://hyperliquid.gitbook.io/hyperliquid-docs/~gitbook/image?url=https%3A%2F%2F2356094849-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FyUdp569E6w18GdfqlGvJ%252Ficon%252FsIAjqhKKIUysM08ahKPh%252FHL-logoSwitchDISliStat.png%3Falt%3Dmedia%26token%3Da81fa25c-0510-4d97-87ff-3fb8944935b1&width=32&dpr=4&quality=100&sign=3e1219e3&sv=2",
        alt: "Hyperliquid"
      },
      {
        src: "https://s2.coinmarketcap.com/static/img/coins/64x64/36341.png",
        alt: "Aster"
      },
      {
        src: "https://cdn.prod.website-files.com/66b5e4e47712e879f0c5ef1b/686bcf104a9c1d2d2c69c5da_r.svg",
        alt: "Reya"
      },
      {
        src: "/gas.png",
        alt: "Gas Refuel"
      }
    ],
    // Protocol logos
    [
      {
        src: "/aave.jpg",
        alt: "Aave"
      },
      {
        src: "/euler.jpg",
        alt: "Euler"
      },
      {
        src: "/morpho.jpg",
        alt: "Morpho"
      },
      {
        src: "/gas.png",
        alt: "Gas Refuel"
      }
    ]
  ];

  // Rotate logo sets every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoSet(prev => (prev + 1) % logoSets.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [logoSets.length]);

  // Rotate central logo every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCentralLogo(prev => (prev + 1) % centralLogos.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [centralLogos.length]);

  const features = [
    { 
      icon: Globe, 
      title: 'Multi-DEX Trading',
      description: 'Trade on Hyperliquid, Aster, Reya, and more'
    },
    { 
      icon: ArrowRightLeft, 
      title: 'Cross-Chain Native',
      description: 'crosschain liquidity from anywhere and Open Positions to any DEX'
    },
    { 
      icon: TrendingUp, 
      title: 'Real-Time Data',
      description: 'Live funding rates and market data'
    },
    { 
      icon: BarChart3, 
      title: 'One-Click Positions',
      description: 'Open long/short positions with leverage on any PERP DEX'
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 bg-black">
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-green-400/30 rounded-full animate-ping" style={{animationDelay: '5s'}}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-black/20 via-black/30 to-black/20 backdrop-blur-2xl border border-white/20 rounded-full text-gray-200 text-sm font-bold mb-8 shadow-2xl hover:shadow-3xl transition-all duration-500 group ring-1 ring-white/10 hover:ring-white/20 animate-pulse-slow">
            <span className="group-hover:text-white transition-all duration-500 tracking-wider uppercase bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-blue-100 group-hover:to-white group-hover:animate-pulse">Avail Nexus • Cross-Chain • DeFi Hub</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight tracking-tight">
            <span className="text-white bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent animate-fadeIn">
              Universal Perpetual Aggregator
            </span>
            <br />
            <span className="text-gray-400 animate-fadeIn font-light" style={{animationDelay: '0.2s'}}>
              Trade Any Perpetual, Anywhere
            </span>
          </h1>
          
          <p className="text-base text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed font-normal animate-fadeIn" style={{animationDelay: '0.4s'}}>
            Trade perpetuals on Hyperliquid, Aster, Reya, and more — all from one unified interface. 
            Bridge USDC from any chain and open positions with one click, powered by Avail Nexus SDK.
          </p>

          {/* Professional Circular Animation */}
          <div className="relative mb-20 flex justify-center items-center">
            <div className="relative w-96 h-96 flex items-center justify-center">
               {/* Background glow effect */}
               <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 via-white/5 to-gray-500/5 rounded-full blur-3xl animate-pulse-glow"></div>
               
               {/* Outer rotating ring - invisible */}
               <div className="absolute inset-0 rounded-full animate-spin-slow">
                 <div className="w-full h-full rounded-full border-2 border-transparent p-1">
                   <div className="w-full h-full rounded-full"></div>
                 </div>
                 {/* Orbiting dots - invisible */}
                 <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 w-5 h-5 rounded-full animate-pulse-orb"></div>
                 <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 w-4 h-4 rounded-full animate-pulse-orb" style={{animationDelay: '1s'}}></div>
                 <div className="absolute left-0 top-1/2 transform -translate-x-3 -translate-y-1/2 w-3 h-3 rounded-full animate-pulse-orb" style={{animationDelay: '2s'}}></div>
                 <div className="absolute right-0 top-1/2 transform translate-x-3 -translate-y-1/2 w-4 h-4 rounded-full animate-pulse-orb" style={{animationDelay: '3s'}}></div>
               </div>
               
               {/* Inner rotating ring - invisible */}
               <div className="absolute inset-12 rounded-full animate-spin-reverse">
                 <div className="w-full h-full rounded-full border border-transparent"></div>
                 {/* Inner orbiting elements - invisible */}
                 <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full animate-pulse-orb"></div>
                 <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full animate-pulse-orb" style={{animationDelay: '1.5s'}}></div>
               </div>
               
               {/* Center content with Avail logo */}
               <div className="relative z-20 text-center">
                 <div className="flex items-center justify-center">
                   <div className="relative">
                     {/* Glowing background ring */}
                     <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse-glow"></div>
                     
                     {/* Rotating outer ring - invisible */}
                     <div className="absolute inset-0 w-24 h-24 mx-auto border border-transparent rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
                     
                     {/* Main logo with enhanced animation */}
                     <div className="relative">
                       <img 
                         src={centralLogos[centralLogo].src} 
                         alt={centralLogos[centralLogo].alt} 
                         className={`${centralLogos[centralLogo].size} object-contain transition-all duration-700 ease-in-out transform hover:scale-110`}
                         style={{
                           animation: 'pulse-glow 3s ease-in-out infinite, float-gentle 4s ease-in-out infinite',
                           animationDelay: `${centralLogo * 0.5}s`
                         }}
                       />
                       {/* Glow effect that changes with logo */}
                       <div 
                         className="absolute inset-0 rounded-full blur-xl opacity-60"
                         style={{
                           background: centralLogo === 0 
                             ? 'radial-gradient(circle, rgba(0,255,0,0.3) 0%, transparent 70%)'
                             : 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
                           animation: 'pulse-glow 3s ease-in-out infinite'
                         }}
                       />
                     </div>
                     
                     {/* Floating particles around logo */}
                     <div className="absolute -top-2 -left-2 w-1 h-1 bg-white/60 rounded-full animate-float-1"></div>
                     <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-float-2"></div>
                     <div className="absolute -bottom-2 -left-1 w-1 h-1 bg-purple-400/60 rounded-full animate-float-3"></div>
                     <div className="absolute -bottom-1 -right-2 w-1 h-1 bg-pink-400/60 rounded-full animate-float-4"></div>
                   </div>
                 </div>
               </div>
               
               {/* Floating protocols coming together */}
               <div className="absolute inset-0">
                 {/* Protocol 1 - starts top-left, moves to top */}
                 <div className="absolute top-1/4 left-1/4 animate-float-together-1">
                   <div className="relative">
                     {/* Glow effect */}
                     <div className="absolute inset-0 w-10 h-10 bg-blue-500/20 rounded-full blur-sm animate-pulse"></div>
                     <img 
                       src={logoSets[logoSet][0].src} 
                       alt={logoSets[logoSet][0].alt} 
                       className="relative w-8 h-8 rounded-full object-contain transition-all duration-1000 ease-out drop-shadow-lg"
                     />
                   </div>
                 </div>
                 
                 {/* Protocol 2 - starts bottom-right, moves to right */}
                 <div className="absolute bottom-1/4 right-1/4 animate-float-together-2">
                   <div className="relative">
                     {/* Glow effect */}
                     <div className="absolute inset-0 w-10 h-10 bg-purple-500/20 rounded-full blur-sm animate-pulse" style={{animationDelay: '0.5s'}}></div>
                     <img 
                       src={logoSets[logoSet][1].src} 
                       alt={logoSets[logoSet][1].alt} 
                       className="relative w-8 h-8 rounded-full object-contain transition-all duration-1000 ease-out drop-shadow-lg"
                     />
                   </div>
                 </div>
                 
                 {/* Protocol 3 - starts top-right, moves to bottom */}
                 <div className="absolute top-1/3 right-1/3 animate-float-together-3">
                   <div className="relative">
                     {/* Glow effect */}
                     <div className="absolute inset-0 w-10 h-10 bg-pink-500/20 rounded-full blur-sm animate-pulse" style={{animationDelay: '1s'}}></div>
                     <img 
                       src={logoSets[logoSet][2].src} 
                       alt={logoSets[logoSet][2].alt} 
                       className="relative w-8 h-8 rounded-full object-contain transition-all duration-1000 ease-out drop-shadow-lg"
                     />
                   </div>
                 </div>
                 
                 {/* Protocol 4 - starts bottom-left, moves to left */}
                 <div className="absolute bottom-1/3 left-1/3 animate-float-together-4">
                   <div className="relative flex items-center justify-center">
                     {/* Glow effect */}
                     <div className="absolute inset-0 w-10 h-10 bg-cyan-500/20 rounded-full blur-sm animate-pulse" style={{animationDelay: '1.5s'}}></div>
                       <img 
                         src={logoSets[logoSet][3].src} 
                         alt={logoSets[logoSet][3].alt} 
                         className="relative w-8 h-8 object-contain transition-all duration-1000 ease-out drop-shadow-lg brightness-0 invert"
                       />
                   </div>
                 </div>
               </div>
              
              
               {/* Floating particles */}
               <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-white/40 rounded-full animate-float-1"></div>
               <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-gray-300/50 rounded-full animate-float-2"></div>
               <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-white/30 rounded-full animate-float-3"></div>
               <div className="absolute top-2/3 left-1/4 w-1 h-1 bg-gray-200/40 rounded-full animate-float-4"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:border-white/25 hover:scale-105 animate-fadeIn overflow-hidden ring-1 ring-white/5"
                style={{animationDelay: `${0.6 + index * 0.1}s`}}
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <feature.icon className="h-8 w-8 text-gray-300 group-hover:text-white transition-all duration-500 mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3" />
                  <h3 className="font-semibold text-gray-100 mb-3 text-sm text-center group-hover:text-white transition-colors duration-300">{feature.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed text-center group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 animate-fadeIn" style={{animationDelay: '1s'}}>
          <div className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 text-center shadow-2xl hover:shadow-3xl hover:border-white/25 transition-all duration-500 hover:scale-105 overflow-hidden ring-1 ring-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-all duration-300 group-hover:scale-110">4+</div>
              <p className="text-gray-400 font-medium text-xs leading-relaxed group-hover:text-gray-300 transition-colors duration-300">Perpetual DEXes</p>
              <p className="text-gray-500 text-xs mt-2 group-hover:text-gray-400 transition-colors duration-300">Hyperliquid, Aster, Reya & more</p>
              <div className="mt-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse group-hover:animate-ping"></div>
              </div>
            </div>
          </div>
          <div className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 text-center shadow-2xl hover:shadow-3xl hover:border-white/25 transition-all duration-500 hover:scale-105 overflow-hidden ring-1 ring-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-white mb-4 group-hover:text-green-400 transition-all duration-300 group-hover:scale-110">Auto Yield</div>
              <p className="text-gray-400 font-medium text-xs leading-relaxed group-hover:text-gray-300 transition-colors duration-300">Yield Optimization</p>
              <p className="text-gray-500 text-xs mt-2 group-hover:text-gray-400 transition-colors duration-300">Best rates across Aave, Morpho, Compound</p>
              <div className="mt-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse group-hover:animate-ping"></div>
              </div>
            </div>
          </div>
          <div className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 text-center shadow-2xl hover:shadow-3xl hover:border-white/25 transition-all duration-500 hover:scale-105 overflow-hidden ring-1 ring-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-white mb-4 group-hover:text-purple-400 transition-all duration-300 group-hover:scale-110">Refuel</div>
              <p className="text-gray-400 font-medium text-xs leading-relaxed group-hover:text-gray-300 transition-colors duration-300">Gas Refuel</p>
              <p className="text-gray-500 text-xs mt-2 group-hover:text-gray-400 transition-colors duration-300">Cross-chain gas from any token</p>
              <div className="mt-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse group-hover:animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}