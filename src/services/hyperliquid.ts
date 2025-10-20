import { BridgeAndExecuteParams, BridgeAndExecuteResult, SUPPORTED_CHAINS_IDS, SUPPORTED_TOKENS, TOKEN_METADATA } from '@avail-project/nexus-widgets';
import { ethers, parseUnits } from 'ethers';
import { Abi } from 'viem';
/*
 Hyperliquid Bridge Contract Configuration (testnet Only) and also USDC2 is the testnet version of USDC line 73
*/

// Hyperliquid Bridge Contract Configuration (Mainnet Only)
export const HYPERLIQUID_BRIDGE_CONFIG = {
  bridgeAddress: '0x2df1c51e09aecf9cacb7bc98cb1742757f163df7',
  usdcAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  chainId: 42161, // Arbitrum Mainnet
  domainVersion: '2'
};

//  export const HYPERLIQUID_BRIDGE_CONFIG = {
//   bridgeAddress: '0x08cfc1B6b2dCF36A1480b99353A354AA8AC56f89',
//   usdcAddress: '0x1baAbB04529D43a73232B713C0FE471f7c7334d5',
//   chainId: 421614, // Arbitrum testnet
//   domainVersion: '1'
// };

// USDC ABI for permit functionality
export const USDC_ABI = [
  'function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external',
  'function nonces(address owner) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function name() external view returns (string)',
  'function balanceOf(address account) external view returns (uint256)',
  'function allowance(address owner, address spender) external view returns (uint256)'
];

// Bridge ABI for deposit functionality
export const BRIDGE_ABI = [
  'function batchedDepositWithPermit((address user, uint64 usd, uint64 deadline, (uint256 r, uint256 s, uint8 v) signature)[] deposits) external',
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

export class HyperliquidService {
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
    
    // Use the official domain name from Hyperliquid docs
    // For mainnet: name: "USD Coin", version: "2"
    
    const correctDomainName = "USD Coin"; // mainnet
    // const correctDomainName = "USDC2"; // testnet
    
    console.log('Using official EIP-712 domain name:', correctDomainName);
    
    this._config = {
      ...HYPERLIQUID_BRIDGE_CONFIG,
      domainName: correctDomainName // Use official domain name from docs
    };
    
    return this._config;
  }

  /**
   * Get the current nonce for USDC permit
   */
  async getUSDCNonce(owner: string): Promise<string> {
    const usdcContract = new ethers.Contract(HYPERLIQUID_BRIDGE_CONFIG.usdcAddress, USDC_ABI, this.provider);
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
    
    // Get USDC decimals dynamically
    const usdcContract = new ethers.Contract(config.usdcAddress, USDC_ABI, this.provider);
    const decimals = await usdcContract.decimals();
    const value = ethers.parseUnits(amount, decimals);
    
    // Create permit payload
    const payload: PermitPayload = {
      owner: userAddress,
      spender: config.bridgeAddress,
      value: value.toString(),
      nonce,
      deadline
    };

    console.log('Permit payload:', payload);
    console.log('USDC decimals:', decimals);
    console.log('Value in wei:', value.toString());

    // Get actual chain ID from network
    const { chainId } = await this.provider.getNetwork();
    
    // Create domain for EIP-712 signing
    const domain = {
      name: config.domainName, // Now uses actual contract name
      version: config.domainVersion,
      chainId: Number(chainId), // Use actual chain ID
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
    
    console.log('Permit signature:', signature);
    
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

  // /**
  //  * Deposit USDC to Hyperliquid using permit
  //  */
  // async depositToHyperliquid(params: DepositParams): Promise<{
  //   success: boolean;
  //   txHash?: string;
  //   error?: string;
  // }> {
  //   try {
  //     const config = await this.getConfig();
      
  //     // Get USDC decimals dynamically
  //     const usdcContract = new ethers.Contract(config.usdcAddress, USDC_ABI, this.provider);
  //     const decimals = await usdcContract.decimals();
  //     const amountInWei = ethers.parseUnits(params.amount, decimals);
  //     const minimumAmount = ethers.parseUnits('5', decimals);
      
  //     // Validate minimum deposit amount (5 USDC)
  //     if (amountInWei < minimumAmount) {
  //       return {
  //         success: false,
  //         error: 'Minimum deposit amount is 5 USDC'
  //       };
  //     }

  //     // Check if user is on correct network
  //     const { chainId } = await this.provider.getNetwork();
  //     console.log('Current network chain ID:', chainId);
  //     console.log('Expected chain ID:', config.chainId);
      
  //     if (Number(chainId) !== config.chainId) {
  //       return {
  //         success: false,
  //         error: `Please switch to Arbitrum network (Chain ID: ${config.chainId}). Current network: ${chainId}`
  //       };
  //     }

  //     // Check user has sufficient USDC balance
  //     const balance = await usdcContract.balanceOf(params.userAddress);
  //     console.log('USDC balance:', ethers.formatUnits(balance, decimals));
      
  //     if (balance < amountInWei) {
  //       return {
  //         success: false,
  //         error: `Insufficient USDC balance. You have ${ethers.formatUnits(balance, decimals)} USDC, need ${params.amount} USDC`
  //       };
  //     }

  //     // Note: No need to check allowance for permit-based flows
  //     // The bridge contract will call permit() internally

  //     // Create deadline (1 hour from now)
  //     const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
      
  //     // Create permit signature with wei values (as required by USDC permit)
  //     const { signature } = await this.createPermitSignature(params.amount, deadline.toString());
  //     const { v, r, s } = this.splitSignature(signature);
      
  //     console.log('Signature components:', { v, r, s });

  //     // Create bridge contract instance
  //     const bridgeContract = new ethers.Contract(config.bridgeAddress, BRIDGE_ABI, this.signer);

  //     // Test if contract is paused
  //     try {
  //       const isPaused = await bridgeContract.paused();
  //       if (isPaused) {
  //         return {
  //           success: false,
  //           error: 'Hyperliquid bridge is currently paused. Please try again later.'
  //         };
  //       }
  //     } catch (error) {
  //       console.error('Contract connection test failed:', error);
  //       return {
  //         success: false,
  //         error: 'Cannot connect to Hyperliquid bridge contract. Please check your network connection.'
  //       };
  //     }

  //     // Create deposit struct with wei values to match permit signature
  //     const deposit = {
  //       user: params.userAddress,
  //       usd: Number(amountInWei),  // Wei values (5000000) to match permit
  //       deadline: Number(deadline), // Convert to number for uint64
  //       signature: {
  //         r: r,  // uint256 r
  //         s: s,  // uint256 s  
  //         v: v   // uint8 v
  //       }
  //     };

  //     // Critical check: signer must match deposit user
  //     const signerAddr = await this.signer.getAddress();
  //     console.log("Signer Address:", signerAddr);
  //     console.log("Deposit User:", deposit.user);
  //     console.log("Addresses match:", signerAddr.toLowerCase() === deposit.user.toLowerCase());
      
  //     console.log('Deposit sent to bridge:', {
  //       user: deposit.user,
  //       usd: deposit.usd.toString(),        // micro-USDC integer
  //       deadline: deposit.deadline.toString(),
  //       v, r, s
  //     });

  //     // Call batchedDepositWithPermit with correct tuple structure
  //     console.log('Attempting batchedDepositWithPermit...');
  //     console.log('Deposit struct being sent:', {
  //       user: deposit.user,
  //       usd: deposit.usd,
  //       deadline: deposit.deadline,
  //       signature: deposit.signature
  //     });
      
  //     // Log the signature components separately to match the example format
  //     console.log('Signature components (r, s, v):', {
  //       r: deposit.signature.r,
  //       s: deposit.signature.s,
  //       v: deposit.signature.v
  //     });
      
  //     try {
  //       // The function expects an array of DepositWithPermit structs
  //       const deposits = [{
  //         user: deposit.user,
  //         usd: deposit.usd,
  //         deadline: deposit.deadline,
  //         signature: deposit.signature
  //       }];
        
  //       const tx = await bridgeContract.batchedDepositWithPermit(deposits, {
  //         gasLimit: 500000
  //       });
        
  //       console.log('Transaction submitted:', tx.hash);
  //       const receipt = await tx.wait();
        
  //       return {
  //         success: true,
  //         txHash: receipt.hash
  //       };
  //     } catch (txError) {
  //       console.error('Bridge deposit failed:', txError);
  //       return {
  //         success: false,
  //         error: 'Bridge deposit failed. Please check your USDC balance and try again.'
  //       };
  //     }

  //   } catch (error) {
  //     console.error('Hyperliquid deposit error:', error);
      
  //     let errorMessage = 'Deposit failed';
  //     if (error instanceof Error) {
  //       if (error.message.includes('insufficient funds')) {
  //         errorMessage = 'Insufficient funds for deposit';
  //       } else if (error.message.includes('user rejected')) {
  //         errorMessage = 'Transaction was cancelled by user';
  //       } else if (error.message.includes('execution reverted')) {
  //         errorMessage = 'Transaction failed - please check your USDC balance and try again';
  //       } else if (error.message.includes('missing revert data')) {
  //         errorMessage = 'Transaction would fail - please ensure you have sufficient USDC balance';
  //       } else {
  //         errorMessage = error.message;
  //       }
  //     }

  //     return {
  //       success: false,
  //       error: errorMessage
  //     };
  //   }
  // }






  /**
   * Deposit USDC to Hyperliquid using permit
   */
  async depositToHyperliquid(params: DepositParams, sdk?: any): Promise<{
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
      
      // if (balance < amountInWei) {
      //   return {
      //     success: false,
      //     error: `Insufficient USDC balance. You have ${ethers.formatUnits(balance, decimals)} USDC, need ${params.amount} USDC`
      //   };
      // }

      // Note: No need to check allowance for permit-based flows
      // The bridge contract will call permit() internally

      // Create deadline (1 hour from now)
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
      
      // Create permit signature with wei values (as required by USDC permit)
      const { signature } = await this.createPermitSignature(params.amount, deadline.toString());
      const { v, r, s } = this.splitSignature(signature);
      
      console.log('Signature components:', { v, r, s });

      // Create bridge contract instance
      const bridgeContract = new ethers.Contract(config.bridgeAddress, BRIDGE_ABI, this.signer);

      // Test if contract is paused
      try {
        const isPaused = await bridgeContract.paused();
        if (isPaused) {
          return {
            success: false,
            error: 'Hyperliquid bridge is currently paused. Please try again later.'
          };
        }
      } catch (error) {
        console.error('Contract connection test failed:', error);
        return {
          success: false,
          error: 'Cannot connect to Hyperliquid bridge contract. Please check your network connection.'
        };
      }

      // Create deposit struct with wei values to match permit signature
      const deposit = {
        user: params.userAddress,
        usd: Number(amountInWei),  // Wei values (5000000) to match permit
        deadline: Number(deadline), // Convert to number for uint64
        signature: {
          r: r,  // uint256 r
          s: s,  // uint256 s  
          v: v   // uint8 v
        }
      };
      const depositss = [deposit];

      // Critical check: signer must match deposit user
      const signerAddr = await this.signer.getAddress();
      console.log("Signer Address:", signerAddr);
      console.log("Deposit User:", deposit.user);
      console.log("Addresses match:", signerAddr.toLowerCase() === deposit.user.toLowerCase());
      
      console.log('Deposit sent to bridge:', {
        user: deposit.user,
        usd: deposit.usd.toString(),        // micro-USDC integer
        deadline: deposit.deadline.toString(),
        v, r, s
      });

      // Call batchedDepositWithPermit with correct tuple structure
      console.log('Attempting batchedDepositWithPermit...');
      console.log('Deposit struct being sent:', {
        user: deposit.user,
        usd: deposit.usd,
        deadline: deposit.deadline,
        signature: deposit.signature
      });
      
      // Log the signature components separately to match the example format
      console.log('Signature components (r, s, v):', {
        r: deposit.signature.r,
        s: deposit.signature.s,
        v: deposit.signature.v
      });
      
      try {
        // The function expects an array of DepositWithPermit structs
        const deposits = [{
          user: deposit.user,
          usd: deposit.usd,
          deadline: deposit.deadline,
          signature: deposit.signature
        }];
        
        // const tx = await bridgeContract.batchedDepositWithPermit(deposits, {
        //   gasLimit: 500000
        // });

const contractAbi: Abi = [
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "user", type: "address" },
          { internalType: "uint64", name: "usd", type: "uint64" },
          { internalType: "uint64", name: "deadline", type: "uint64" },
          {
            components: [
              { internalType: "uint256", name: "r", type: "uint256" },
              { internalType: "uint256", name: "s", type: "uint256" },
              { internalType: "uint8", name: "v", type: "uint8" }
            ],
            internalType: "struct Signature",
            name: "signature",
            type: "tuple"
          }
        ],
        internalType: "struct BatchedDeposit[]",
        name: "deposits",
        type: "tuple[]"
      }
    ],
    name: "batchedDepositWithPermit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];


        const result: BridgeAndExecuteResult = await sdk?.bridgeAndExecute({
          token: 'USDC',
          amount: deposit.usd,
          toChainId: HYPERLIQUID_BRIDGE_CONFIG.chainId,
          execute: {
            contractAddress: HYPERLIQUID_BRIDGE_CONFIG.bridgeAddress,
            contractAbi: contractAbi,
            functionName: 'batchedDepositWithPermit',
            buildFunctionParams: () => {
              const deposits = [depositss];
              return {
                functionParams: [depositss],
              };
            },
          
            tokenApproval: {
              token: 'USDC',
              amount: deposit.usd
            },
          },
          waitForReceipt: true, 
          requiredConfirmations: 3,
        } as unknown as BridgeAndExecuteParams);
  
        console.log('result', result);
        
        // Check if the operation actually succeeded
        if (result && result.success && result.executeTransactionHash) {
          console.log('Transaction submitted:', result.executeTransactionHash);
          return {
            success: true,
            txHash: result.executeTransactionHash
          };
        } else {
          // Extract error message from the result
          const errorMessage = result?.error || 'Bridge and execute operation failed';
          throw new Error(errorMessage);
        }
      } catch (txError) {
        console.error('Bridge deposit failed:', txError);
        return {
          success: false,
          error: 'Bridge deposit failed. Please check your USDC balance and try again.'
        };
      }

    } catch (error) {
      console.error('Hyperliquid deposit error:', error);
      
      let errorMessage = 'Deposit failed';
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
   * Batch deposit multiple USDC amounts to Hyperliquid
   */
  async batchDepositToHyperliquid(params: BatchDepositParams): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> {
    try {
      const config = await this.getConfig();
      const usdcContract = new ethers.Contract(config.usdcAddress, USDC_ABI, this.provider);
      const decimals = await usdcContract.decimals();
      
      // Validate all deposits
      for (const deposit of params.deposits) {
        const amountInWei = ethers.parseUnits(deposit.amount, decimals);
        const minimumAmount = ethers.parseUnits('5', decimals);
        
        if (amountInWei < minimumAmount) {
          return {
            success: false,
            error: `Minimum deposit amount is 5 USDC for deposit: ${deposit.amount}`
          };
        }
      }

      // Check network
      const { chainId } = await this.provider.getNetwork();
      if (Number(chainId) !== config.chainId) {
        return {
          success: false,
          error: `Please switch to Arbitrum network (Chain ID: ${config.chainId}). Current network: ${chainId}`
        };
      }

      // Create deadline
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
      
      // Create deposit structures
      const deposits = await Promise.all(
        params.deposits.map(async (deposit) => {
          const { signature } = await this.createPermitSignature(deposit.amount, deadline.toString());
          const { v, r, s } = this.splitSignature(signature);
          
          const amountInWei = ethers.parseUnits(deposit.amount, decimals);
          
          return {
            user: deposit.userAddress,
            usd: amountInWei, // BigInt - EXACT match to permit value
            deadline: deadline, // BigInt
            signature: { v, r, s }
          };
        })
      );

      // Create bridge contract instance
      const bridgeContract = new ethers.Contract(config.bridgeAddress, BRIDGE_ABI, this.signer);

      // Check if paused
      const isPaused = await bridgeContract.paused();
      if (isPaused) {
        return {
          success: false,
          error: 'Hyperliquid bridge is currently paused. Please try again later.'
        };
      }

      // Execute batch deposit
      const tx = await bridgeContract.batchedDepositWithPermit(deposits);
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash
      };

    } catch (error) {
      console.error('Batch deposit error:', error);
      
      let errorMessage = 'Batch deposit failed';
      if (error instanceof Error) {
        if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds for batch deposit';
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transaction was cancelled by user';
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
      const usdcContract = new ethers.Contract(HYPERLIQUID_BRIDGE_CONFIG.usdcAddress, USDC_ABI, this.provider);
      const balance = await usdcContract.balanceOf(userAddress);
      const balanceFormatted = ethers.formatUnits(balance, 6);
      
      return {
        balance: balanceFormatted,
        hasEnough: balance > 0n
      };
    } catch (error) {
      console.error('USDC balance check error:', error);
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
      return Number(network.chainId) === HYPERLIQUID_BRIDGE_CONFIG.chainId;
    } catch (error) {
      console.error('Network check error:', error);
      return false;
    }
  }

  /**
   * Switch to Arbitrum network
   */
  async switchToArbitrum(): Promise<boolean> {
    try {
      const chainId = `0x${HYPERLIQUID_BRIDGE_CONFIG.chainId.toString(16)}`;
      
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }]
      });
      
      return true;
    } catch (error) {
      console.error('Network switch error:', error);
      return false;
    }
  }
}

