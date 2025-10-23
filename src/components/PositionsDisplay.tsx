import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, RefreshCw, X, Eye, EyeOff } from 'lucide-react';
import { useHyperliquidPosition } from '../hooks/useHyperliquidPosition';

interface Position {
  coin: string;
  entryPx: number;
  leverage: number;
  liquidationPx: number;
  marginUsed: number;
  maxLeverage: number;
  positionValue: number;
  returnOnEquity: number;
  szi: number;
  unrealizedPnl: number;
  isLong: boolean;
  dex?: string; // Which DEX the position is on
}

interface PositionsDisplayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PositionsDisplay: React.FC<PositionsDisplayProps> = ({ isOpen, onClose }) => {
  const { getUserPositions, closePosition, isClosingPosition } = useHyperliquidPosition(true);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showValues, setShowValues] = useState(true);

  const fetchPositions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userPositions = await getUserPositions();
      setPositions(userPositions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch positions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPositions();
    }
  }, [isOpen]);

  const handleClosePosition = async (coin: string, szi: number) => {
    try {
      // Find the asset index for the coin (this would need to be mapped properly)
      const assetIndex = 0; // This should be mapped based on coin symbol
      const result = await closePosition(assetIndex, Math.abs(szi).toString());
      
      if (result.success) {
        // Refresh positions after closing
        await fetchPositions();
      } else {
        setError(result.error || 'Failed to close position');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close position');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return 'text-green-400';
    if (pnl < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getPnLIcon = (pnl: number) => {
    if (pnl > 0) return <TrendingUp className="w-4 h-4" />;
    if (pnl < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  const getAssetIcon = (coin: string) => {
    const iconMap: { [key: string]: string } = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'SOL': '◎',
      'AVAX': '🔺',
      'MATIC': '⬟',
      'ARB': '🔺',
      'OP': '🔺',
      'LINK': '🔗',
      'UNI': '🦄',
      'AAVE': '👻'
    };
    return iconMap[coin] || coin.charAt(0);
  };

  const getDexInfo = (dex?: string) => {
    const dexMap: { [key: string]: { name: string; color: string; bgColor: string } } = {
      'hyperliquid': { name: 'Hyperliquid', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
      'aster': { name: 'Aster', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
      'reya': { name: 'Reya', color: 'text-green-400', bgColor: 'bg-green-500/20' },
      'default': { name: 'Unknown', color: 'text-gray-400', bgColor: 'bg-gray-500/20' }
    };
    return dexMap[dex || 'default'] || dexMap['default'];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Your Positions</h2>
              <p className="text-sm text-gray-400">Manage your perpetual positions</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowValues(!showValues)}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
              title={showValues ? 'Hide values' : 'Show values'}
            >
              {showValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={fetchPositions}
              disabled={isLoading}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
              title="Refresh positions"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-white">Loading positions...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchPositions}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : positions.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No positions found</p>
                <p className="text-sm text-gray-500">You don't have any open positions yet</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-300">Total Positions</p>
                      <p className="text-2xl font-bold text-white">{positions.length}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-300">Total PnL</p>
                      <p className={`text-2xl font-bold ${getPnLColor(positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0))}`}>
                        {showValues ? formatCurrency(positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0)) : '••••••'}
                      </p>
                    </div>
                    {getPnLIcon(positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-300">Total Value</p>
                      <p className="text-2xl font-bold text-white">
                        {showValues ? formatCurrency(positions.reduce((sum, pos) => sum + pos.positionValue, 0)) : '••••••'}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Positions Table */}
              <div className="bg-black/20 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Asset</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">DEX</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Side</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Size</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Entry Price</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Leverage</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">PnL</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ROE</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {positions.map((position, index) => (
                        <tr key={index} className="hover:bg-white/5 transition-colors duration-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-lg flex items-center justify-center">
                                <span className="text-sm font-bold text-orange-400">{getAssetIcon(position.coin)}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-white">{position.coin}</p>
                                <p className="text-xs text-gray-400">Perpetual</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDexInfo(position.dex).bgColor} ${getDexInfo(position.dex).color} border border-current/30`}>
                                {getDexInfo(position.dex).name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              position.isLong 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {position.isLong ? 'Long' : 'Short'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-white font-medium">
                              {showValues ? Math.abs(position.szi).toFixed(4) : '••••'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {showValues ? formatCurrency(position.positionValue) : '••••••'}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-white">
                              {showValues ? formatCurrency(position.entryPx) : '••••••'}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-medium">{position.leverage.toFixed(1)}x</span>
                              <div className="w-16 h-1 bg-gray-700 rounded-full">
                                <div 
                                  className="h-full bg-blue-500 rounded-full" 
                                  style={{ width: `${Math.min((position.leverage / position.maxLeverage) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {getPnLIcon(position.unrealizedPnl)}
                              <span className={`font-medium ${getPnLColor(position.unrealizedPnl)}`}>
                                {showValues ? formatCurrency(position.unrealizedPnl) : '••••••'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-medium ${getPnLColor(position.returnOnEquity)}`}>
                              {showValues ? formatPercentage(position.returnOnEquity) : '••••'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleClosePosition(position.coin, position.szi)}
                              disabled={isClosingPosition}
                              className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                              {isClosingPosition ? 'Closing...' : 'Close'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
