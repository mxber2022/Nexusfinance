import { useState, useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { HyperliquidService, DepositParams } from '../services/hyperliquid';
import { ethers } from 'ethers';

export interface UseHyperliquidReturn {
  depositToHyperliquid: (amount: string) => Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }>;
  isDepositing: boolean;
  checkNetwork: () => Promise<boolean>;
  switchToArbitrum: () => Promise<boolean>;
  checkUSDCBalance: (userAddress: string) => Promise<{
    balance: string;
    hasEnough: boolean;
    requiredAmount?: string;
  }>;
}

export const useHyperliquid = (isMainnet: boolean = true): UseHyperliquidReturn => { // Default to mainnet
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isDepositing, setIsDepositing] = useState(false);

  const depositToHyperliquid = useCallback(async (amount: string) => {
    if (!walletClient || !address) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    setIsDepositing(true);

    try {
      // Create provider and signer from wallet client
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      
      // Initialize Hyperliquid service
      const hyperliquidService = new HyperliquidService(provider, signer);

      // Check if user is on correct network
      const isCorrectNetwork = await hyperliquidService.checkNetwork();
      if (!isCorrectNetwork) {
        const switched = await hyperliquidService.switchToArbitrum();
        if (!switched) {
          return {
            success: false,
            error: 'Please switch to Arbitrum network'
          };
        }
      }

      // Create deposit parameters
      const depositParams: DepositParams = {
        amount,
        userAddress: address,
        isMainnet
      };

      // Execute deposit
      const result = await hyperliquidService.depositToHyperliquid(depositParams);
      
      return result;

    } catch (error) {
      console.error('Hyperliquid deposit error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    } finally {
      setIsDepositing(false);
    }
  }, [walletClient, address, isMainnet]);

  const checkNetwork = useCallback(async () => {
    if (!walletClient) return false;
    
    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const hyperliquidService = new HyperliquidService(provider, signer);
      
      return await hyperliquidService.checkNetwork();
    } catch (error) {
      console.error('Network check error:', error);
      return false;
    }
  }, [walletClient, isMainnet]);

  const switchToArbitrum = useCallback(async () => {
    if (!walletClient) return false;
    
    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const hyperliquidService = new HyperliquidService(provider, signer);
      
      return await hyperliquidService.switchToArbitrum();
    } catch (error) {
      console.error('Network switch error:', error);
      return false;
    }
  }, [walletClient, isMainnet]);

  const checkUSDCBalance = useCallback(async (userAddress: string) => {
    if (!walletClient) {
      return {
        balance: '0',
        hasEnough: false
      };
    }
    
    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const hyperliquidService = new HyperliquidService(provider, signer);
      
      return await hyperliquidService.checkUSDCBalance(userAddress);
    } catch (error) {
      console.error('USDC balance check error:', error);
      return {
        balance: '0',
        hasEnough: false
      };
    }
  }, [walletClient, isMainnet]);

  return {
    depositToHyperliquid,
    isDepositing,
    checkNetwork,
    switchToArbitrum,
    checkUSDCBalance
  };
};
