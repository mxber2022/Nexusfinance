import { useState, useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import { HyperliquidPositionService, PositionParams, PositionResult, MarketMetadata } from '../services/hyperliquidPosition';

export interface UseHyperliquidPositionReturn {
  // Position operations
  openPosition: (params: PositionParams) => Promise<PositionResult>;
  closePosition: (assetIndex: number, size: string) => Promise<PositionResult>;
  getUserPositions: () => Promise<any[]>;
  
  // Market data
  getMarketMetadata: () => Promise<MarketMetadata[]>;
  getAssetPrice: (assetIndex: number) => Promise<string>;
  
  // Network operations
  checkNetwork: () => Promise<boolean>;
  switchNetwork: () => Promise<boolean>;
  
  // Loading states
  isOpeningPosition: boolean;
  isClosingPosition: boolean;
  isLoadingMarketData: boolean;
  
  // Error states
  error: string | null;
  
  // Clear error
  clearError: () => void;
}

export const useHyperliquidPosition = (isTestnet: boolean = true): UseHyperliquidPositionReturn => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  const [isOpeningPosition, setIsOpeningPosition] = useState(false);
  const [isClosingPosition, setIsClosingPosition] = useState(false);
  const [isLoadingMarketData, setIsLoadingMarketData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const openPosition = useCallback(async (params: PositionParams): Promise<PositionResult> => {
    if (!walletClient || !address) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    setIsOpeningPosition(true);
    setError(null);

    try {
      // Create provider and signer from wallet client
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      
      // Initialize Hyperliquid position service
      const positionService = new HyperliquidPositionService(provider, signer, isTestnet);

      // Check if user is on correct network
      const isCorrectNetwork = await positionService.checkNetwork();
      if (!isCorrectNetwork) {
        const switched = await positionService.switchNetwork();
        if (!switched) {
          return {
            success: false,
            error: `Please switch to ${isTestnet ? 'Arbitrum Sepolia' : 'Arbitrum'} network`
          };
        }
      }

      // Open position
      const result = await positionService.openPosition(params);
      
      if (!result.success) {
        setError(result.error || 'Failed to open position');
      }

      return result;

    } catch (error) {
      console.error('Position opening error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsOpeningPosition(false);
    }
  }, [walletClient, address, isTestnet]);

  const closePosition = useCallback(async (assetIndex: number, size: string): Promise<PositionResult> => {
    if (!walletClient || !address) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    setIsClosingPosition(true);
    setError(null);

    try {
      // Create provider and signer from wallet client
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      
      // Initialize Hyperliquid position service
      const positionService = new HyperliquidPositionService(provider, signer, isTestnet);

      // Check if user is on correct network
      const isCorrectNetwork = await positionService.checkNetwork();
      if (!isCorrectNetwork) {
        const switched = await positionService.switchNetwork();
        if (!switched) {
          return {
            success: false,
            error: `Please switch to ${isTestnet ? 'Arbitrum Sepolia' : 'Arbitrum'} network`
          };
        }
      }

      // Close position
      const result = await positionService.closePosition(assetIndex, size);
      
      if (!result.success) {
        setError(result.error || 'Failed to close position');
      }

      return result;

    } catch (error) {
      console.error('Position closing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsClosingPosition(false);
    }
  }, [walletClient, address, isTestnet]);

  const getUserPositions = useCallback(async (): Promise<any[]> => {
    if (!walletClient || !address) {
      return [];
    }

    try {
      // Create provider and signer from wallet client
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      
      // Initialize Hyperliquid position service
      const positionService = new HyperliquidPositionService(provider, signer, isTestnet);

      // Get user positions
      return await positionService.getUserPositions();

    } catch (error) {
      console.error('Error fetching user positions:', error);
      return [];
    }
  }, [walletClient, address, isTestnet]);

  const getMarketMetadata = useCallback(async (): Promise<MarketMetadata[]> => {
    if (!walletClient) {
      return [];
    }

    setIsLoadingMarketData(true);
    setError(null);

    try {
      // Create provider and signer from wallet client
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      
      // Initialize Hyperliquid position service
      const positionService = new HyperliquidPositionService(provider, signer, isTestnet);

      // Get market metadata
      return await positionService.getMarketMetadata();

    } catch (error) {
      console.error('Error fetching market metadata:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch market data';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoadingMarketData(false);
    }
  }, [walletClient, isTestnet]);

  const getAssetPrice = useCallback(async (assetIndex: number): Promise<string> => {
    if (!walletClient) {
      return '0';
    }

    try {
      // Create provider and signer from wallet client
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      
      // Initialize Hyperliquid position service
      const positionService = new HyperliquidPositionService(provider, signer, isTestnet);

      // Get asset price
      return await positionService.getAssetPrice(assetIndex);

    } catch (error) {
      console.error('Error fetching asset price:', error);
      return '0';
    }
  }, [walletClient, isTestnet]);

  const checkNetwork = useCallback(async (): Promise<boolean> => {
    if (!walletClient) return false;
    
    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const positionService = new HyperliquidPositionService(provider, signer, isTestnet);
      
      return await positionService.checkNetwork();
    } catch (error) {
      console.error('Network check error:', error);
      return false;
    }
  }, [walletClient, isTestnet]);

  const switchNetwork = useCallback(async (): Promise<boolean> => {
    if (!walletClient) return false;
    
    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const positionService = new HyperliquidPositionService(provider, signer, isTestnet);
      
      return await positionService.switchNetwork();
    } catch (error) {
      console.error('Network switch error:', error);
      return false;
    }
  }, [walletClient, isTestnet]);

  return {
    openPosition,
    closePosition,
    getUserPositions,
    getMarketMetadata,
    getAssetPrice,
    checkNetwork,
    switchNetwork,
    isOpeningPosition,
    isClosingPosition,
    isLoadingMarketData,
    error,
    clearError
  };
};
