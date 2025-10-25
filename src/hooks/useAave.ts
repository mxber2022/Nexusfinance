import { useState, useCallback } from 'react';
import { useWalletClient } from 'wagmi';
import { AaveService } from '../services/aave';

export interface UseAaveReturn {
  supplyToAave: (sdk: any, tokenSymbol: string, amount: string, userAddress: string) => Promise<{ success: boolean; txHash?: string; error?: string }>;
  getEstimatedAPY: (tokenSymbol: string) => Promise<string>;
  checkBalance: (tokenSymbol: string, amount: string, userAddress: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useAave(): UseAaveReturn {
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aaveService = walletClient ? new AaveService(walletClient) : null;

  const supplyToAave = useCallback(async (
    sdk: any,
    tokenSymbol: string,
    amount: string,
    userAddress: string
  ) => {
    if (!aaveService) {
      return {
        success: false,
        error: 'Public client not available'
      };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await aaveService.supplyToAave(sdk, tokenSymbol, amount, userAddress);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, [aaveService]);

  const getEstimatedAPY = useCallback(async (tokenSymbol: string) => {
    if (!aaveService) return '2.50%';
    
    try {
      return await aaveService.getEstimatedAPY(tokenSymbol);
    } catch (err) {
      console.error('Error getting APY:', err);
      return '2.50%'; // Default fallback
    }
  }, [aaveService]);

  const checkBalance = useCallback(async (
    tokenSymbol: string,
    amount: string,
    userAddress: string
  ) => {
    if (!aaveService) return false;
    
    try {
      return await aaveService.checkBalance(tokenSymbol, amount, userAddress);
    } catch (err) {
      console.error('Error checking balance:', err);
      return false;
    }
  }, [aaveService]);

  return {
    supplyToAave,
    getEstimatedAPY,
    checkBalance,
    isLoading,
    error
  };
}
