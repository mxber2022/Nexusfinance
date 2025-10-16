import React from 'react';
import { X } from 'lucide-react';
import { getFundingRateColor, getFundingRateBgColor } from '../services/hyperliquidApi';
import { getAsterFundingRateColor, getAsterFundingRateBgColor } from '../services/asterApi';
import { getReyaFundingRateColor, getReyaFundingRateBgColor } from '../services/reyaApi';
import { DEX } from '../constants/dexes';
import { Asset } from '../constants/marketData';
import { StatusBar } from './StatusBar';

interface HyperliquidData {
  [key: string]: {
    HlPerp?: {
      fundingRate: number;
      formattedRate: string;
      nextFundingInHours: number;
      fundingIntervalHours: number;
      isPositive: boolean;
    };
  };
}

interface AsterData {
  [key: string]: {
    fundingRate: number;
    formattedRate: string;
    markPrice: number;
    indexPrice: number;
    nextFundingInHours: number;
  };
}

interface ReyaData {
  [key: string]: {
    fundingRate: number;
    formattedRate: string;
    symbol: string;
    nextFundingInHours: number;
    isPositive: boolean;
  };
}

interface MarketDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDEX: DEX;
  onDEXSelect: (dex: DEX) => void;
  DEXES: DEX[];
  MARKET_DATA: { [key: string]: Asset };
  // Hyperliquid data
  hyperliquidData: HyperliquidData;
  hyperliquidBestRates: any;
  isHyperliquidLoading: boolean;
  hyperliquidError: string | null;
  hyperliquidLastUpdated: Date | null;
  onRefreshHyperliquid: () => void;
  // Aster data
  asterData: AsterData;
  asterBestRates: any;
  isAsterLoading: boolean;
  asterError: string | null;
  asterLastUpdated: Date | null;
  onRefreshAster: () => void;
  // Reya data
  reyaData: ReyaData;
  reyaBestRates: any;
  isReyaLoading: boolean;
  reyaError: string | null;
  reyaLastUpdated: Date | null;
  onRefreshReya: () => void;
}

export const MarketDataDialog: React.FC<MarketDataDialogProps> = ({
  isOpen,
  onClose,
  selectedDEX,
  onDEXSelect,
  DEXES,
  MARKET_DATA,
  hyperliquidData,
  hyperliquidBestRates,
  isHyperliquidLoading,
  hyperliquidError,
  hyperliquidLastUpdated,
  onRefreshHyperliquid,
  asterData,
  asterBestRates,
  isAsterLoading,
  asterError,
  asterLastUpdated,
  onRefreshAster,
  reyaData,
  reyaBestRates,
  isReyaLoading,
  reyaError,
  reyaLastUpdated,
  onRefreshReya,
}) => {
  if (!isOpen) return null;

  const handleRefreshAll = () => {
    onRefreshHyperliquid();
    onRefreshAster();
    onRefreshReya();
  };

  const isAnyLoading = isHyperliquidLoading || isAsterLoading || isReyaLoading;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-black/30 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 max-h-[80vh] overflow-y-auto shadow-2xl ring-1 ring-white/10 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-all duration-300 backdrop-blur-xl border border-white/10 z-10"
        >
          <X className="w-4 h-4 text-gray-300" />
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(MARKET_DATA).map(([key, asset]) => {
            const assetSymbol = asset.symbol;
            const realTimeData = hyperliquidData[assetSymbol];
            const bestRate = hyperliquidBestRates[assetSymbol];
            
            // Map asset symbols to Aster API symbols
            const asterSymbol = assetSymbol === 'BTC' ? 'BTCUSDT' : 'ETHUSDT';
            const asterRealTimeData = asterData[asterSymbol];
            const asterBestRate = asterBestRates[asterSymbol];
            
            // Reya data uses direct asset symbols
            const reyaRealTimeData = reyaData[assetSymbol];
            const reyaBestRate = reyaBestRates[assetSymbol];
            
            return (
              <div key={key} className="bg-black/10 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl ring-1 ring-white/5">
                {/* Asset Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={asset.logo} alt={asset.name} className="w-8 h-8 rounded-full border border-white/20 shadow-md" />
                    <div>
                      <h3 className="text-lg font-bold text-white">{asset.name}</h3>
                      <p className="text-xs text-gray-400">{asset.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">
                        {asterRealTimeData ? `$${asterRealTimeData.markPrice.toLocaleString()}` : 'Loading...'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Position Selection and Action Buttons */}
                <div className="mb-6 p-4 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white">Open Position</h4>
                      <p className="text-xs text-gray-400 mt-1">Selected DEX: <span className="text-white font-medium">{selectedDEX.name}</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Position:</span>
                      <div className="flex bg-black/40 rounded-lg p-1">
                        <button className="px-3 py-1 text-xs font-medium rounded-md bg-green-500/20 text-green-400 border border-green-500/30">
                          Long
                        </button>
                        <button className="px-3 py-1 text-xs font-medium rounded-md text-gray-400 hover:text-white transition-colors">
                          Short
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 group">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-green-400 font-semibold text-sm">Open Long</span>
                      </div>
                    </button>
                    
                    <button className="p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-lg hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300 group">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-red-400 font-semibold text-sm">Open Short</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Real-time Hyperliquid Data */}
                {realTimeData && realTimeData.HlPerp ? (
                  <div className="mb-6">
                    <button 
                      onClick={() => onDEXSelect(DEXES.find(dex => dex.id === 'hyperliquid')!)}
                      className={`w-full p-4 rounded-xl transition-all duration-500 ease-in-out text-left border-2 ${
                        selectedDEX.id === 'hyperliquid'
                          ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/60 shadow-xl shadow-blue-500/30 ring-2 ring-blue-400/20'
                          : 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:from-blue-500/15 hover:to-cyan-500/15 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <img src="https://hyperliquid.gitbook.io/hyperliquid-docs/~gitbook/image?url=https%3A%2F%2F2356094849-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FyUdp569E6w18GdfqlGvJ%252Ficon%252FsIAjqhKKIUysM08ahKPh%252FHL-logoSwitchDISliStat.png%3Falt%3Dmedia%26token%3Da81fa25c-0510-4d97-87ff-3fb8944935b1&width=32&dpr=4&quality=100&sign=3e1219e3&sv=2" alt="Hyperliquid" className="w-6 h-6 rounded-full" />
                        <span className="font-semibold text-white">Hyperliquid</span>
                        <div className="ml-auto">
                          {selectedDEX.id === 'hyperliquid' ? (
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30 transition-all duration-300 ease-in-out animate-fadeIn">
                              Selected
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-full opacity-0">
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Funding Rate:</span>
                            <span className={`font-bold text-sm ${getFundingRateColor(realTimeData.HlPerp.fundingRate)}`}>
                              {realTimeData.HlPerp.formattedRate}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Next Funding:</span>
                            <span className="text-white font-bold text-sm">
                              {realTimeData.HlPerp.nextFundingInHours}h
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Interval:</span>
                            <span className="text-white font-bold text-sm">
                              {realTimeData.HlPerp.fundingIntervalHours}h
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Status:</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${realTimeData.HlPerp.isPositive ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                              {realTimeData.HlPerp.isPositive ? 'Longs Pay' : 'Shorts Pay'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-500/10 border border-gray-500/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Real-time data unavailable</span>
                      {hyperliquidError && (
                        <span className="text-red-400 text-xs">{hyperliquidError}</span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Real-time Aster Data */}
                {asterRealTimeData ? (
                  <div className="mb-6">
                    <button 
                      onClick={() => onDEXSelect(DEXES.find(dex => dex.id === 'aster')!)}
                      className={`w-full p-4 rounded-xl transition-all duration-500 ease-in-out text-left border-2 ${
                        selectedDEX.id === 'aster'
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/60 shadow-xl shadow-purple-500/30 ring-2 ring-purple-400/20'
                          : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:from-purple-500/15 hover:to-pink-500/15 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/36341.png" alt="Aster" className="w-6 h-6 rounded-full" />
                        <span className="font-semibold text-white">Aster</span>
                        <div className="ml-auto">
                          {selectedDEX.id === 'aster' ? (
                            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30 transition-all duration-300 ease-in-out animate-fadeIn">
                              Selected
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-full opacity-0">
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Funding Rate:</span>
                            <span className={`font-bold text-sm ${getAsterFundingRateColor(asterRealTimeData.fundingRate)}`}>
                              {asterRealTimeData.formattedRate}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Mark Price:</span>
                            <span className="text-white font-bold text-sm">
                              ${asterRealTimeData.markPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Index Price:</span>
                            <span className="text-white font-bold text-sm">
                              ${asterRealTimeData.indexPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Next Funding:</span>
                            <span className="text-white font-bold text-sm">
                              {asterRealTimeData.nextFundingInHours}h
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-500/10 border border-gray-500/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Aster real-time data unavailable</span>
                      {asterError && (
                        <span className="text-red-400 text-xs">{asterError}</span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Real-time Reya Data */}
                {reyaRealTimeData ? (
                  <div className="mb-6">
                    <button 
                      onClick={() => onDEXSelect(DEXES.find(dex => dex.id === 'reya')!)}
                      className={`w-full p-4 rounded-xl transition-all duration-500 ease-in-out text-left border-2 ${
                        selectedDEX.id === 'reya'
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-400/60 shadow-xl shadow-indigo-500/30 ring-2 ring-indigo-400/20'
                          : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20 hover:from-indigo-500/15 hover:to-purple-500/15 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <img src="https://cdn.prod.website-files.com/66b5e4e47712e879f0c5ef1b/686bcf104a9c1d2d2c69c5da_r.svg" alt="Reya" className="w-6 h-6" />
                        <span className="font-semibold text-white">Reya</span>
                        <div className="ml-auto">
                          {selectedDEX.id === 'reya' ? (
                            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full border border-indigo-500/30 transition-all duration-300 ease-in-out animate-fadeIn">
                              Selected
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-full opacity-0">
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Funding Rate:</span>
                            <span className={`font-bold text-sm ${getReyaFundingRateColor(reyaRealTimeData.fundingRate)}`}>
                              {reyaRealTimeData.formattedRate}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Symbol:</span>
                            <span className="text-white font-bold text-sm">
                              {reyaRealTimeData.symbol}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Next Funding:</span>
                            <span className="text-white font-bold text-sm">
                              {reyaRealTimeData.nextFundingInHours}h
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Status:</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${reyaRealTimeData.isPositive ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                              {reyaRealTimeData.isPositive ? 'Longs Pay' : 'Shorts Pay'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-500/10 border border-gray-500/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Reya real-time data unavailable</span>
                      {reyaError && (
                        <span className="text-red-400 text-xs">{reyaError}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </div>
        
      </div>
      
      {/* Status Bar - Outside the dialog */}
      <StatusBar
        isHyperliquidLoading={isHyperliquidLoading}
        hyperliquidError={hyperliquidError}
        hyperliquidLastUpdated={hyperliquidLastUpdated}
        onRefreshHyperliquid={onRefreshHyperliquid}
        isAsterLoading={isAsterLoading}
        asterError={asterError}
        asterLastUpdated={asterLastUpdated}
        onRefreshAster={onRefreshAster}
        isReyaLoading={isReyaLoading}
        reyaError={reyaError}
        reyaLastUpdated={reyaLastUpdated}
        onRefreshReya={onRefreshReya}
      />
    </div>
  );
};
