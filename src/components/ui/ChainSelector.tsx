import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { Chain, ChainSelectorProps } from '../../types';

export function ChainSelector({ chains, selectedChain, onChainSelect, balance }: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getChainColor = (chainId: number) => {
    const colors = {
      1: 'from-blue-500 to-cyan-500',      // Ethereum
      42161: 'from-purple-500 to-violet-500', // Arbitrum
      43114: 'from-red-500 to-orange-500',    // Avalanche
      137: 'from-indigo-500 to-purple-500',  // Polygon
      56: 'from-yellow-500 to-orange-500',   // BSC
    };
    return colors[chainId as keyof typeof colors] || 'from-gray-500 to-slate-500';
  };

  return (
    <div className="relative">
      {/* Chain Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl px-4 py-4 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 group"
      >
        {/* Subtle background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.03)_0%,transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg">
              <img 
                src={selectedChain.logo} 
                alt={selectedChain.name}
                className="w-6 h-6 rounded-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="hidden items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md">
                <span className="text-white font-bold text-xs">
                  {selectedChain.nativeCurrency.symbol.charAt(0)}
                </span>
              </div>
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-100 group-hover:text-white transition-colors duration-300">
                {selectedChain.name}
              </div>
              <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {selectedChain.nativeCurrency.symbol} • Chain ID: {selectedChain.id}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {balance && (
              <div className="text-right">
                <div className="text-sm font-medium text-gray-100">
                  {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                </div>
                <div className="text-xs text-gray-400">Balance</div>
              </div>
            )}
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-black/40 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden ring-1 ring-white/5 animate-fadeIn">
          {/* Subtle background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.03)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-xl"></div>
          
          <div className="relative z-10 p-2 max-h-64 overflow-y-auto">
            {chains.map((chain, index) => {
              const isSelected = selectedChain.id === chain.id;
              
              return (
                <button
                  key={chain.id}
                  onClick={() => {
                    onChainSelect(chain);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group hover:scale-[1.02] ${
                    isSelected 
                      ? 'bg-blue-500/10 border border-blue-500/20 shadow-lg' 
                      : 'hover:bg-white/5 border border-transparent hover:shadow-lg'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src={chain.logo} 
                        alt={chain.name}
                        className="w-7 h-7 rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="hidden items-center justify-center w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md">
                        <span className="text-white font-bold text-xs">
                          {chain.nativeCurrency.symbol.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-100 group-hover:text-white transition-colors duration-300">
                        {chain.name}
                      </div>
                      <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {chain.nativeCurrency.symbol} • Chain ID: {chain.id}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                      Available
                    </span>
                    {isSelected && (
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full animate-pulse">
                        <Check className="w-3 h-3 text-blue-400" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
