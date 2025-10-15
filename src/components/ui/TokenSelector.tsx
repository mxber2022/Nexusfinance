import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { Token, TokenSelectorProps } from '../../types';

export function TokenSelector({ tokens, selectedToken, onTokenSelect, balance, getTokenBalance }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Don't render if no selected token
  if (!selectedToken) {
    return (
      <div className="w-full bg-black/20 backdrop-blur-xl border border-white/15 rounded-2xl p-4">
        <div className="text-center text-gray-400">Loading tokens...</div>
      </div>
    );
  }

  const formatBalance = (balance?: { formatted: string; symbol: string }) => {
    if (!balance) return '0.00';
    // Use the original formatted balance without rounding
    return `${balance.formatted} ${balance.symbol}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black/20 backdrop-blur-xl border border-white/15 rounded-2xl p-4 hover:bg-black/30 hover:border-white/25 transition-all duration-300 shadow-xl hover:shadow-2xl group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg">
              <img 
                src={selectedToken.icon} 
                alt={selectedToken.symbol}
                className="w-6 h-6 rounded-md"
                onError={(e) => {
                  console.log('Image failed to load:', selectedToken.icon);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', selectedToken.icon);
                }}
              />
              <div className="hidden items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md">
                <span className="text-white font-bold text-xs">
                  {selectedToken.symbol.charAt(0)}
                </span>
              </div>
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-100 group-hover:text-white transition-colors duration-300">
                {selectedToken.symbol}
              </div>
              <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {selectedToken.name}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {balance && (
              <div className="text-right">
                <div className="text-xs text-gray-400">Balance</div>
                <div className="text-sm font-medium text-gray-200">
                  {formatBalance(balance)}
                </div>
              </div>
            )}
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/40 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            {tokens.map((token, index) => (
              <button
                key={`${token.symbol}-${token.chainId}`}
                onClick={() => {
                  console.log('Selecting token:', {
                    symbol: token.symbol,
                    icon: token.icon,
                    isNative: token.isNative,
                    chainId: token.chainId,
                  });
                  onTokenSelect(token);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                  selectedToken.symbol === token.symbol && selectedToken.chainId === token.chainId
                    ? 'bg-white/10 border border-white/30 text-white'
                    : 'hover:bg-white/5 border border-transparent hover:shadow-lg'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src={token.icon} 
                      alt={token.symbol}
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
                        {token.symbol.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-100 group-hover:text-white transition-colors duration-300">
                      {token.symbol}
                    </div>
                    <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {token.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getTokenBalance && (
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Balance</div>
                      <div className="text-sm font-medium text-gray-200">
                        {(() => {
                          const balance = getTokenBalance(token);
                          console.log(`TokenSelector - Balance for ${token.symbol}:`, balance);
                          return formatBalance(balance);
                        })()}
                      </div>
                    </div>
                  )}
                  {selectedToken.symbol === token.symbol && selectedToken.chainId === token.chainId && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
