import React, { useState } from 'react';
import { useHyperliquidPosition } from '../hooks/useHyperliquidPosition';
import { PositionParams } from '../types';

export const OpenPositionButton: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const { openPosition, isOpeningPosition, error, clearError } = useHyperliquidPosition(true);

  const handleOpenPosition = async () => {
    try {
      setStatus('Opening position...');
      clearError();

      const params: PositionParams = {
        assetIndex: 0, // BTC
        isLong: true, // Long position
        price: '50000', // Entry price
        size: '0.01', // Position size
        leverage: 10, // 10x leverage
        isTestnet: true
      };

      const result = await openPosition(params);
      
      if (result.success) {
        setStatus(`✅ Position opened successfully! Order ID: ${result.orderId}`);
      } else {
        setStatus(`❌ Error: ${result.error}`);
      }
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Error: ${err.message || err.toString()}`);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center border rounded-lg shadow-md space-y-4 max-w-md mx-auto">
      <h2 className="text-lg font-bold">Open Position on Hyperliquid</h2>
      <button
        onClick={handleOpenPosition}
        disabled={isOpeningPosition}
        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isOpeningPosition ? 'Opening...' : 'Open Long (BTC)'}
      </button>
      {status && <p className="text-sm text-gray-700">{status}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
