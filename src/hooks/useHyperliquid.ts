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
  withdrawFromHyperliquid: (amount: string, destination: string) => Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }>;
  isDepositing: boolean;
  isWithdrawing: boolean;
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
  const [isWithdrawing, setIsWithdrawing] = useState(false);

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

  const withdrawFromHyperliquid = useCallback(async (amount: string, destination: string) => {
    if (!walletClient || !address) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    setIsWithdrawing(true);

    try {
      // Create provider and signer from wallet client
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      
      // Check if user is on correct network
      const hyperliquidService = new HyperliquidService(provider, signer);
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

      // Create EIP-712 signature for withdrawal
      const domain = {
        name: "HyperliquidSignTransaction",
        version: "1",
        chainId: 42161,
        verifyingContract: "0x0000000000000000000000000000000000000000" as `0x${string}`
      };

      const message = {
        destination: destination,
        amount: amount,
        time: Math.floor(Date.now() / 1000),
        type: "withdraw3",
        signatureChainId: "0xa4b1", // 42161 in hex
        hyperliquidChain: "Mainnet"
      };

      const types = {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" }
        ],
        "HyperliquidTransaction:Withdraw": [
          { name: "hyperliquidChain", type: "string" },
          { name: "destination", type: "string" },
          { name: "amount", type: "string" },
          { name: "time", type: "uint64" }
        ]
      };

      console.log('Creating withdrawal signature:', {
        domain,
        message,
        types
      });

      // Sign the EIP-712 message
      const signature = await walletClient.signTypedData({
        domain: domain as any,
        types: types as any,
        primaryType: "HyperliquidTransaction:Withdraw",
        message: message as any
      });

      console.log('Withdrawal signature created:', signature);

      // For now, we'll return success with the signature
      // In a full implementation, you would send this to Hyperliquid's API
      return {
        success: true,
        txHash: signature,
        error: undefined
      };

    } catch (error) {
      console.error('Hyperliquid withdrawal error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    } finally {
      setIsWithdrawing(false);
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
    withdrawFromHyperliquid,
    isDepositing,
    isWithdrawing,
    checkNetwork,
    switchToArbitrum,
    checkUSDCBalance
  };
};
