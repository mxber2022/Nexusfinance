import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { Slider } from './ui/Slider';
import { useHyperliquidPosition } from '../hooks/useHyperliquidPosition';
import type { PositionParams, PositionResult } from '../services/hyperliquidPosition'; // adjust path

export interface PositionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assetSymbol: string;
  assetName: string;
  currentPrice: string;
  positionType: 'long' | 'short';
  onPositionOpen: (params: PositionParams) => Promise<PositionResult>;
  isOpening?: boolean; // external loading state
  error?: string | null; // external error message
  onClearError: () => void;
}

export const PositionDialog: React.FC<PositionDialogProps> = ({
  isOpen,
  onClose,
  assetSymbol,
  assetName,
  currentPrice,
  positionType,
  onPositionOpen,
  isOpening = false,
  error,
  onClearError,
}) => {
  const [leverage, setLeverage] = useState<number>(10);
  const [size, setSize] = useState<string>('100');
  const [price, setPrice] = useState<string>(currentPrice || '0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [availableBalance, setAvailableBalance] = useState<string>('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Get Hyperliquid position hook
  const { getUserBalance } = useHyperliquidPosition(true); // Using testnet

  // keep price synced to currentPrice when not editing
  useEffect(() => {
    if (!price || price === '0') {
      setPrice(currentPrice || '0');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPrice]);

  useEffect(() => {
    if (isOpen) {
      onClearError();
      setSuccess(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Fetch user's Hyperliquid balance when dialog opens
  useEffect(() => {
    const fetchUserBalance = async () => {
      if (!isOpen) return;
      
      setIsLoadingBalance(true);
      try {
        const result = await getUserBalance();
        if (result.success && result.balance !== undefined) {
          const balanceStr = result.balance.toFixed(2);
          setAvailableBalance(balanceStr);
          setSize(balanceStr); // Set as default position size
        } else {
          console.log('Could not fetch user balance:', result.error);
          setAvailableBalance('0');
          setSize('100'); // Fallback to default
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        setAvailableBalance('0');
        setSize('100'); // Fallback to default
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchUserBalance();
  }, [isOpen, getUserBalance]);

  const calculateNotionalValue = () => {
    const sizeNum = parseFloat(size) || 0;
    const levNum = leverage || 1;
    return (sizeNum * levNum).toFixed(2);
  };

  const calculateMargin = () => {
    const sizeNum = parseFloat(size) || 0;
    return sizeNum.toFixed(2);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSuccess(null);
    onClearError();

    try {
      const params: PositionParams = {
        assetIndex: 0, // adapt if UI supplies index
        isLong: positionType === 'long',
        size: size,
        leverage: leverage,
        isTestnet: true,
      };

      const result = await onPositionOpen(params);

      if (result.success) {
        setSuccess(`Position opened successfully! Order ID: ${result.orderId || 'N/A'}`);
        // reset small form values but keep price sync on next open
        setTimeout(() => {
          setSize('100');
          setLeverage(10);
          setPrice(currentPrice || '0');
        }, 1200);
      } else {
        // show server-side error
        if (result.error) {
          setTimeout(() => {
            // allow UI to display error in case parent wants to
            onClearError();
          }, 1000);
        }
      }
    } catch (err) {
      console.error('Position opening error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">
              Open {positionType === 'long' ? 'Long' : 'Short'} Position
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {assetName} ({assetSymbol})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>


        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Slider
              value={leverage}
              onChange={setLeverage}
              min={1}
              max={40}
              step={1}
              label="Leverage"
              formatValue={(value) => `${value}x`}
              className="mb-4"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">Position Size (USDC)</label>
              <div className="flex items-center space-x-2">
                {isLoadingBalance ? (
                  <span className="text-xs text-gray-500">Loading balance...</span>
                ) : (
                  <span className="text-xs text-gray-400">
                    Available: {availableBalance} USDC
                  </span>
                )}
                <button
                  onClick={() => setSize(availableBalance)}
                  disabled={isLoadingBalance || parseFloat(availableBalance) <= 0}
                  className="px-2 py-1 text-xs bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Max
                </button>
              </div>
            </div>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="100"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 bg-black/30 backdrop-blur-xl border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-white/40 focus:outline-none transition-all duration-300 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
          </div>


          {/* Summary */}
          <div className="p-4 bg-black/20 border border-white/10 rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-3">Position Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className={`font-medium ${positionType === 'long' ? 'text-green-400' : 'text-red-400'}`}>
                  {positionType === 'long' ? 'Long' : 'Short'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Leverage:</span>
                <span className="text-white">{leverage}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Size:</span>
                <span className="text-white">{size} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Entry Price:</span>
                <span className="text-blue-400">Market Price</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Margin Required:</span>
                <span className="text-white">{calculateMargin()} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Notional Value:</span>
                <span className="text-white font-semibold">{calculateNotionalValue()} USDC</span>
              </div>
            </div>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-green-400 text-sm">{success}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isOpening}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                positionType === 'long'
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 disabled:opacity-50'
                  : 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 disabled:opacity-50'
              }`}
            >
              {isSubmitting || isOpening ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Opening...</span>
                </div>
              ) : (
                `Open ${positionType === 'long' ? 'Long' : 'Short'} Position`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
