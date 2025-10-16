import React from 'react';

interface StatusBarProps {
  // Hyperliquid data
  isHyperliquidLoading: boolean;
  hyperliquidError: string | null;
  hyperliquidLastUpdated: Date | null;
  onRefreshHyperliquid: () => void;
  // Aster data
  isAsterLoading: boolean;
  asterError: string | null;
  asterLastUpdated: Date | null;
  onRefreshAster: () => void;
  // Reya data
  isReyaLoading: boolean;
  reyaError: string | null;
  reyaLastUpdated: Date | null;
  onRefreshReya: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  isHyperliquidLoading,
  hyperliquidError,
  hyperliquidLastUpdated,
  onRefreshHyperliquid,
  isAsterLoading,
  asterError,
  asterLastUpdated,
  onRefreshAster,
  isReyaLoading,
  reyaError,
  reyaLastUpdated,
  onRefreshReya,
}) => {
  const handleRefreshAll = () => {
    onRefreshHyperliquid();
    onRefreshAster();
    onRefreshReya();
  };

  const isAnyLoading = isHyperliquidLoading || isAsterLoading || isReyaLoading;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black/30 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 shadow-2xl ring-1 ring-white/10">
          <div className="flex items-center justify-between">
          {/* Left side - Pro Tip */}
          <div className="text-blue-300 text-sm">
            💡 <strong>Pro Tip:</strong> Choose the DEX with the best rates for your position!
          </div>
          
          {/* Right side - Status indicators and refresh button */}
          <div className="flex items-center gap-4">
            {/* Status Indicators */}
            <div className="flex items-center gap-3">
              {/* Hyperliquid Status */}
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isHyperliquidLoading ? 'bg-yellow-400 animate-pulse' : hyperliquidError ? 'bg-red-400' : 'bg-green-400'}`}></div>
                <span className="text-xs text-gray-300">Hyperliquid</span>
              </div>
              
              {/* Aster Status */}
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isAsterLoading ? 'bg-yellow-400 animate-pulse' : asterError ? 'bg-red-400' : 'bg-green-400'}`}></div>
                <span className="text-xs text-gray-300">Aster</span>
              </div>
              
              {/* Reya Status */}
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isReyaLoading ? 'bg-yellow-400 animate-pulse' : reyaError ? 'bg-red-400' : 'bg-green-400'}`}></div>
                <span className="text-xs text-gray-300">Reya</span>
              </div>
            </div>
            
            {/* Refresh Button and Last Updated */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshAll}
                disabled={isAnyLoading}
                className="p-1.5 bg-black/40 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:bg-black/50"
                title={isAnyLoading ? 'Refreshing...' : 'Refresh All'}
              >
                <svg className={`w-3.5 h-3.5 text-white ${isAnyLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <div className="text-xs text-gray-400">
                {hyperliquidLastUpdated && `${hyperliquidLastUpdated.toLocaleTimeString()}`}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
