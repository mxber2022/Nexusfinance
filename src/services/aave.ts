import { BridgeAndExecuteParams, BridgeAndExecuteResult } from '@avail-project/nexus-widgets';
import { Abi, PublicClient, parseUnits } from 'viem';

// Aave V3 Pool Contract Configuration
export const AAVE_V3_CONFIG = {
  poolAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD', // Aave V3 Pool on Arbitrum
  chainId: 42161, // Arbitrum Mainnet
  usdcAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
  usdtAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT on Arbitrum
  ethAddress: '0x0000000000000000000000000000000000000000', // ETH native token
};

// Aave V3 Pool ABI for supply function
export const AAVE_POOL_ABI: Abi = [
  {
    name: 'supply',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'asset', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'onBehalfOf', type: 'address' },
      { name: 'referralCode', type: 'uint16' },
    ],
    outputs: [],
  },
] as const;

export class AaveService {
  private publicClient: PublicClient;

  constructor(publicClient: PublicClient) {
    this.publicClient = publicClient;
  }

  /**
   * Get the appropriate asset address for the token
   */
  getAssetAddress(tokenSymbol: string): string {
    switch (tokenSymbol.toUpperCase()) {
      case 'USDC':
        return AAVE_V3_CONFIG.usdcAddress;
      case 'USDT':
        return AAVE_V3_CONFIG.usdtAddress;
      case 'ETH':
        return AAVE_V3_CONFIG.ethAddress;
      default:
        throw new Error(`Unsupported token: ${tokenSymbol}`);
    }
  }

  /**
   * Supply tokens to Aave V3 using Nexus SDK bridge and execute
   */
  async supplyToAave(
    sdk: any,
    tokenSymbol: string,
    amount: string,
    userAddress: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!sdk) {
        throw new Error('Nexus SDK not provided');
      }

      const assetAddress = this.getAssetAddress(tokenSymbol);
      const amountWei = parseUnits(amount, tokenSymbol === 'ETH' ? 18 : 6);

      console.log('Aave supply parameters:', {
        tokenSymbol,
        amount,
        amountWei: amountWei.toString(),
        assetAddress,
        userAddress,
        poolAddress: AAVE_V3_CONFIG.poolAddress
      });

      // Use bridgeAndExecute to bridge tokens and execute supply on Aave
      const result: BridgeAndExecuteResult = await sdk.bridgeAndExecute({
        token: tokenSymbol as any,
        amount: parseFloat(amount),
        toChainId: AAVE_V3_CONFIG.chainId,
        execute: {
          contractAddress: AAVE_V3_CONFIG.poolAddress,
          contractAbi: AAVE_POOL_ABI,
          functionName: 'supply',
          buildFunctionParams: () => ({
            functionParams: [
              assetAddress,           // asset
              amountWei,              // amount
              userAddress,            // onBehalfOf
              0                       // referralCode (0 = no referral)
            ]
          }),
          tokenApproval: {
            token: tokenSymbol as any,
            amount: parseFloat(amount)
          },
        },
        waitForReceipt: true,
        requiredConfirmations: 3,
      } as unknown as BridgeAndExecuteParams);

      console.log('Aave bridge and execute result:', result);
      
      // Check if the operation actually succeeded
      if (result && result.success && result.executeTransactionHash) {
        return {
          success: true,
          txHash: result.executeTransactionHash
        };
      } else {
        // Extract error message from the result
        const errorMessage = result?.error || 'Bridge and execute operation failed';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Aave supply error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to supply to Aave'
      };
    }
  }

  /**
   * Get estimated APY for a token on Aave V3
   * This is a simplified version - in production you'd fetch from Aave's API
   */
  async getEstimatedAPY(tokenSymbol: string): Promise<string> {
    // Mock APY data - in production, fetch from Aave's API
    const apyData: Record<string, string> = {
      'USDC': '3.06%',
      'USDT': '2.98%',
      'ETH': '1.45%'
    };

    return apyData[tokenSymbol.toUpperCase()] || '2.50%';
  }

  /**
   * Check if the user has sufficient balance for the operation
   */
  async checkBalance(tokenSymbol: string, amount: string, userAddress: string): Promise<boolean> {
    try {
      // This would check the user's balance across all chains
      // For now, we'll assume they have sufficient balance
      return true;
    } catch (error) {
      console.error('Balance check error:', error);
      return false;
    }
  }
}
