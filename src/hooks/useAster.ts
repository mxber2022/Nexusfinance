import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import { AsterService, DepositParams } from '../services/aster';

export interface UseAsterReturn {
  depositToAster: (amount: string, sdk?: any) => Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }>;
  isDepositing: boolean;
  checkNetwork: () => Promise<boolean>;
  switchToArbitrum: () => Promise<boolean>;
}

export const useAster = (isMainnet: boolean = true): UseAsterReturn => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isDepositing, setIsDepositing] = useState(false);

  const depositToAster = useCallback(async (amount: string, sdk?: any) => {
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
      
      // Initialize Aster service
      const asterService = new AsterService(provider, signer);

      // Check if user is on correct network
      const isCorrectNetwork = await asterService.checkNetwork();
      if (!isCorrectNetwork) {
        const switched = await asterService.switchToArbitrum();
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

      // Execute deposit - use Nexus SDK if available, otherwise fallback to direct contract call
      let result;
      if (sdk) {
        result = await asterService.depositToAsterWithNexus(sdk, amount, address);
      } else {
        result = await asterService.depositToAster(depositParams);
      }
      
      return result;

    } catch (error) {
      console.error('Aster deposit error:', error);
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
      const asterService = new AsterService(provider, null as any);
      return await asterService.checkNetwork();
    } catch (error) {
      console.error('Aster network check error:', error);
      return false;
    }
  }, [walletClient, isMainnet]);

  const switchToArbitrum = useCallback(async () => {
    if (!walletClient) return false;
    
    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const asterService = new AsterService(provider, null as any);
      return await asterService.switchToArbitrum();
    } catch (error) {
      console.error('Aster network switch error:', error);
      return false;
    }
  }, [walletClient, isMainnet]);

  return {
    depositToAster,
    isDepositing,
    checkNetwork,
    switchToArbitrum
  };
};
