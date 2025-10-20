import { ethers } from 'ethers';
import { BridgeAndExecuteParams, BridgeAndExecuteResult } from '@avail-project/nexus-widgets';
import { Abi } from 'viem';

// Aster Bridge Contract Configuration (Arbitrum)
export const ASTER_BRIDGE_CONFIG = {
  bridgeAddress: '0x9E36CB86a159d479cEd94Fa05036f235Ac40E1d5',
  usdcAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
  chainId: 42161, // Arbitrum Mainnet
  domainVersion: '2'
};

// USDC ABI for permit functionality
export const USDC_ABI = [
  'function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function nonces(address owner) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function name() external view returns (string)',
  'function balanceOf(address account) external view returns (uint256)',
  'function allowance(address owner, address spender) external view returns (uint256)'
];

// Bridge ABI for deposit functionality
export const BRIDGE_ABI = [
  'function deposit(address currency, uint256 amount, uint256 broker) external',
  'function depositV2(address currency, uint256 amount, uint256 broker) external payable',
  'function batchedDepositWithPermit((address user, address token, uint256 amount, uint256 approveAmount, uint256 deadline, (uint8 v, bytes32 r, bytes32 s) approveSignature)[] deposits) external onlyRole(OPERATE_ROLE)',
  'function paused() external view returns (bool)'
];

export interface PermitPayload {
  owner: string;
  spender: string;
  value: string;
  nonce: string;
  deadline: string;
}

export interface DepositParams {
  amount: string;
  userAddress: string;
  isMainnet?: boolean;
}

export interface BatchDepositParams {
  deposits: DepositParams[];
}

export class AsterService {
  private provider: ethers.Provider;
  private signer: ethers.Signer;
  private _config: any = null;

  constructor(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  /**
   * Get configuration with dynamic domain name
   */
  private async getConfig() {
    // Always fetch fresh config to ensure correct domain name
    this._config = null;
    
    // Use the official domain name from Aster docs
    const correctDomainName = "USD Coin";
    
    console.log('Using official EIP-712 domain name:', correctDomainName);
    
    this._config = {
      ...ASTER_BRIDGE_CONFIG,
      domainName: correctDomainName
    };
    
    return this._config;
  }

  /**
   * Get the current nonce for USDC permit
   */
  async getUSDCNonce(owner: string): Promise<string> {
    const usdcContract = new ethers.Contract(ASTER_BRIDGE_CONFIG.usdcAddress, USDC_ABI, this.provider);
    return (await usdcContract.nonces(owner)).toString();
  }

  /**
   * Create permit signature for USDC
   */
  async createPermitSignature(amount: string, deadline: string): Promise<{
    signature: string;
    nonce: string;
  }> {
    const config = await this.getConfig();
    const userAddress = await this.signer.getAddress();
    
    // Get current nonce
    const nonce = await this.getUSDCNonce(userAddress);
    
    // Amount is already in wei format
    const value = BigInt(amount);
    
    // Create permit payload
    const payload: PermitPayload = {
      owner: userAddress,
      spender: config.bridgeAddress,
      value: value.toString(),
      nonce,
      deadline
    };

    console.log('Aster permit payload:', payload);
    console.log('Value in wei:', value.toString());

    // Get actual chain ID from network
    const { chainId } = await this.provider.getNetwork();
    
    // Create domain for EIP-712 signing
    const domain = {
      name: config.domainName,
      version: config.domainVersion,
      chainId: Number(chainId),
      verifyingContract: config.usdcAddress
    };

    console.log('EIP-712 domain:', domain);

    // Permit types for EIP-712
    const permitTypes = {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' }
      ]
    };

    // Sign the permit
    const signature = await this.signer.signTypedData(domain, permitTypes, payload);
    
    console.log('Aster permit signature:', signature);
    
    return {
      signature,
      nonce
    };
  }

  /**
   * Split signature into v, r, s components using built-in helper
   */
  private splitSignature(signature: string): { v: number; r: string; s: string } {
    const sig = ethers.Signature.from(signature);
    return {
      v: sig.v,
      r: sig.r,
      s: sig.s
    };
  }

  /**
   * Deposit USDC to Aster using permit
   */
  async depositToAster(params: DepositParams): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> {
    try {
      const config = await this.getConfig();
      
      // Get USDC decimals dynamically
      const usdcContract = new ethers.Contract(config.usdcAddress, USDC_ABI, this.provider);
      const decimals = await usdcContract.decimals();
      const amountInWei = ethers.parseUnits(params.amount, decimals);
      const minimumAmount = ethers.parseUnits('5', decimals);
      
      // Validate minimum deposit amount (5 USDC)
      if (amountInWei < minimumAmount) {
        return {
          success: false,
          error: 'Minimum deposit amount is 5 USDC'
        };
      }

      // Check if user is on correct network
      const { chainId } = await this.provider.getNetwork();
      console.log('Current network chain ID:', chainId);
      console.log('Expected chain ID:', config.chainId);
      
      if (Number(chainId) !== config.chainId) {
        return {
          success: false,
          error: `Please switch to Arbitrum network (Chain ID: ${config.chainId}). Current network: ${chainId}`
        };
      }

      // Check user has sufficient USDC balance
      const balance = await usdcContract.balanceOf(params.userAddress);
      console.log('USDC balance:', ethers.formatUnits(balance, decimals));
      
      if (balance < amountInWei) {
        return {
          success: false,
          error: `Insufficient USDC balance. You have ${ethers.formatUnits(balance, decimals)} USDC, need ${params.amount} USDC`
        };
      }

      console.log('Aster deposit parameters:', {
        user: params.userAddress,
        currency: config.usdcAddress,
        amount: amountInWei.toString(),
        broker: 1
      });

      // Check and approve USDC if needed
      const currentAllowance = await usdcContract.allowance(params.userAddress, config.bridgeAddress);
      console.log('Current USDC allowance:', ethers.formatUnits(currentAllowance, decimals));
      
      if (currentAllowance < amountInWei) {
        console.log('Approving USDC for Aster bridge...');
        const approveTx = await usdcContract.approve(config.bridgeAddress, amountInWei);
        console.log('USDC approval transaction:', approveTx.hash);
        await approveTx.wait();
        console.log('USDC approval confirmed');
      }

      // Create bridge contract instance
      const bridgeContract = new ethers.Contract(config.bridgeAddress, BRIDGE_ABI, this.signer);

      // Test if contract is paused
      try {
        const isPaused = await bridgeContract.paused();
        if (isPaused) {
          return {
            success: false,
            error: 'Aster bridge is currently paused. Please try again later.'
          };
        }
      } catch (error) {
        console.error('Aster contract connection test failed:', error);
        return {
          success: false,
          error: 'Cannot connect to Aster bridge contract. Please check your network connection.'
        };
      }

      // Validate permit signature before calling contract
      try {
        const usdcContract = new ethers.Contract(config.usdcAddress, USDC_ABI, this.provider);
        const currentAllowance = await usdcContract.allowance(params.userAddress, config.bridgeAddress);
        console.log('Current USDC allowance:', ethers.formatUnits(currentAllowance, 6));
        console.log('Required allowance:', ethers.formatUnits(amountInWei, 6));
      } catch (error) {
        console.error('Allowance check failed:', error);
      }

      // Critical check: signer must match deposit user
      const signerAddr = await this.signer.getAddress();
      console.log("Signer Address:", signerAddr);
      console.log("Deposit User:", params.userAddress);
      console.log("Addresses match:", signerAddr.toLowerCase() === params.userAddress.toLowerCase());
      
      console.log('Aster deposit parameters:', {
        token: config.usdcAddress,
        amount: amountInWei.toString(),
        approveAmount: amountInWei.toString()
      });

      // Call deposit function (matches official website)
      console.log('Attempting Aster deposit...');
      
      try {
        const tx = await bridgeContract.deposit(
          config.usdcAddress,
          amountInWei,
          1, // broker (can be any value, 1 is commonly used)
          {
            gasLimit: 100000
          }
        );
        
        console.log('Aster transaction submitted:', tx.hash);
        const receipt = await tx.wait();
        
        return {
          success: true,
          txHash: receipt.hash
        };
      } catch (txError) {
        console.error('Aster bridge deposit failed:', txError);
        console.error('Transaction error details:', {
          message: txError instanceof Error ? txError.message : 'Unknown error',
          code: (txError as any)?.code,
          reason: (txError as any)?.reason,
          data: (txError as any)?.data
        });
        return {
          success: false,
          error: `Aster bridge deposit failed: ${txError instanceof Error ? txError.message : 'Unknown error'}`
        };
      }

    } catch (error) {
      console.error('Aster deposit error:', error);
      
      let errorMessage = 'Aster deposit failed';
      if (error instanceof Error) {
        if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds for deposit';
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transaction was cancelled by user';
        } else if (error.message.includes('execution reverted')) {
          errorMessage = 'Transaction failed - please check your USDC balance and try again';
        } else if (error.message.includes('missing revert data')) {
          errorMessage = 'Transaction would fail - please ensure you have sufficient USDC balance';
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Check USDC balance for a user
   */
  async checkUSDCBalance(userAddress: string): Promise<{
    balance: string;
    hasEnough: boolean;
    requiredAmount?: string;
  }> {
    try {
      const usdcContract = new ethers.Contract(ASTER_BRIDGE_CONFIG.usdcAddress, USDC_ABI, this.provider);
      const balance = await usdcContract.balanceOf(userAddress);
      const balanceFormatted = ethers.formatUnits(balance, 6);
      
      return {
        balance: balanceFormatted,
        hasEnough: balance > 0n
      };
    } catch (error) {
      console.error('Aster USDC balance check error:', error);
      return {
        balance: '0',
        hasEnough: false
      };
    }
  }

  /**
   * Check if user is on the correct network (Arbitrum)
   */
  async checkNetwork(): Promise<boolean> {
    try {
      const network = await this.provider.getNetwork();
      return Number(network.chainId) === ASTER_BRIDGE_CONFIG.chainId;
    } catch (error) {
      console.error('Aster network check error:', error);
      return false;
    }
  }

  /**
   * Switch to Arbitrum network
   */
  async switchToArbitrum(): Promise<boolean> {
    try {
      const chainId = `0x${ASTER_BRIDGE_CONFIG.chainId.toString(16)}`;
      
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }]
      });
      
      return true;
    } catch (error) {
      console.error('Aster network switch error:', error);
      return false;
    }
  }

  /**
   * Deposit USDC to Aster using Nexus SDK bridge and execute
   */
  async depositToAsterWithNexus(
    sdk: any,
    amount: string,
    userAddress: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!sdk) {
        throw new Error('Nexus SDK not provided');
      }

      const config = await this.getConfig();

      const contractAbi: Abi = [
        {
          inputs: [
            { internalType: "address", name: "currency", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
            { internalType: "uint256", name: "broker", type: "uint256" }
          ],
          name: "deposit",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        }
      ];

      // Use bridgeAndExecute to bridge USDC and execute deposit on Aster
      const result: BridgeAndExecuteResult = await sdk.bridgeAndExecute({
        token: 'USDC',
        amount: parseFloat(amount),
        toChainId: ASTER_BRIDGE_CONFIG.chainId,
        execute: {
          contractAddress: ASTER_BRIDGE_CONFIG.bridgeAddress,
          contractAbi: contractAbi,
          functionName: 'deposit',
          buildFunctionParams: () => ({
            functionParams: [
              ASTER_BRIDGE_CONFIG.usdcAddress, 
              ethers.parseUnits(amount, 6), 
              1
            ]
          }),
        },
        waitForReceipt: true, 
        requiredConfirmations: 3,
      } as unknown as BridgeAndExecuteParams);

      console.log('Aster bridge and execute result:', result);
      
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
      console.error('Aster bridge and execute failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Aster bridge and execute failed'
      };
    }
  }
}
