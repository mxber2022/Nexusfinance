import { ethers } from 'ethers';
import * as hl from '@nktkas/hyperliquid';

export interface PositionParams {
  assetIndex: number;
  isLong: boolean;
  size: string; // USDC size (string to avoid float rounding issues)
  leverage: number;
  isTestnet?: boolean;
}

export interface PositionResult {
  success: boolean;
  txHash?: string;
  error?: string;
  orderId?: string;
}

export interface MarketMetadata {
  assetIndex: number;
  symbol: string;
  name: string;
  maxLeverage: number;
  minOrderSize: string;
  tickSize: string;
  szDecimals?: number;
}

export class HyperliquidPositionService {
  private provider: ethers.Provider;
  private signer: ethers.Signer;
  private isTestnet: boolean;

  // Cached clients to avoid re-initializing each call
  private exchangeClient?: hl.ExchangeClient;
  private infoClient?: hl.InfoClient;
  private transport?: hl.HttpTransport;

  constructor(provider: ethers.Provider, signer: ethers.Signer, isTestnet: boolean = true) {
    this.provider = provider;
    this.signer = signer;
    this.isTestnet = isTestnet;
  }

  /**
   * Initialize (and cache) Hyperliquid transport and clients
   */
  private async initializeClients() {
    if (this.exchangeClient && this.infoClient && this.transport) {
      return { exchangeClient: this.exchangeClient, infoClient: this.infoClient };
    }

    this.transport = new hl.HttpTransport({
      isTestnet: this.isTestnet,
    });

    // ExchangeClient expects wallet that can sign
    this.exchangeClient = new hl.ExchangeClient({
      wallet: this.signer,
      transport: this.transport,
    });

    this.infoClient = new hl.InfoClient({
      transport: this.transport,
    });

    return { exchangeClient: this.exchangeClient, infoClient: this.infoClient };
  }

  /**
   * Get market metadata for available assets
   */
  async getMarketMetadata(): Promise<MarketMetadata[]> {
    try {
      const { infoClient } = await this.initializeClients();
      const meta = await infoClient.metaAndAssetCtxs();

       // The SDK returns an array; universe often at index 0
       const universe = (meta && meta[0] && meta[0].universe) ? meta[0].universe : [];

      return universe.map((asset: any, index: number) => ({
        assetIndex: index,
        symbol: asset.name || `ASSET_${index}`,
        name: asset.name || `Asset ${index}`,
        maxLeverage: asset.maxLeverage || 50,
        minOrderSize: asset.szDecimals ? `0.${'0'.repeat(asset.szDecimals - 1)}1` : '0.001',
        tickSize: asset.pxDecimals ? `0.${'0'.repeat(asset.pxDecimals - 1)}1` : '0.01',
        szDecimals: asset.szDecimals || 6,
      }));
    } catch (error) {
      console.error('Error fetching market metadata:', error);
      throw new Error('Failed to fetch market metadata');
    }
  }

  /**
   * Get current asset price (returns string)
   */
  async getAssetPrice(assetIndex: number): Promise<string> {
    try {
      const { infoClient } = await this.initializeClients();

      // Get all mids (Record<string, string>)
      const allMids = await infoClient.allMids();
      console.log('All mids:', allMids);

      // Map asset index to symbol
      const assetSymbols = ['BTC', 'ETH', 'SOL', 'AVAX']; // Common assets
      const symbol = assetSymbols[assetIndex];
      
      if (symbol && allMids[symbol]) {
        console.log(`Found price for ${symbol}: ${allMids[symbol]}`);
        return allMids[symbol];
      }

      // Fallback: try metaAndAssetCtxs to get asset name and price
      try {
        const meta = await infoClient.metaAndAssetCtxs();
        const universe = (meta && meta[0] && meta[0].universe) ? meta[0].universe : [];
        const asset = universe[assetIndex];
        
        if (asset && asset.name && allMids[asset.name]) {
          console.log(`Found price for ${asset.name}: ${allMids[asset.name]}`);
          return allMids[asset.name];
        }
      } catch (metaErr) {
        console.warn('infoClient.metaAndAssetCtxs() failed:', metaErr);
      }

      // Final fallback: return conservative placeholder
      const fallbackPrices: Record<number, string> = {
        0: '106000', // BTC
        1: '3500',   // ETH
        2: '200',    // SOL
        3: '40',     // AVAX
      };
      return fallbackPrices[assetIndex] || '100000';
    } catch (error) {
      console.error('Error fetching asset price:', error);
      return '100000';
    }
  }

  /**
   * Calculate order size for target leverage
   * Formula: size = (targetLeverage × collateral) / currentPrice
   */
  private calculateOrderSizeForLeverage(
    targetLeverage: number,
    collateralUSDC: number,
    currentPrice: number,
    szDecimals?: number
  ): string {
    const size = (targetLeverage * collateralUSDC) / currentPrice;
    // Use szDecimals if available, otherwise default to 6
    const precision = szDecimals || 6;
    return size.toFixed(precision);
  }

  /**
   * Validate position parameters locally and against market metadata
   */
  private async validatePosition(params: PositionParams): Promise<{ valid: boolean; error?: string }> {
    try {
      // Validate wallet connection
      let address = '';
      try {
        address = await this.signer.getAddress();
      } catch (addrErr) {
        return { valid: false, error: 'Wallet not connected' };
      }
      if (!address) return { valid: false, error: 'Wallet not connected' };

      // Validate asset index
      if (!Number.isInteger(params.assetIndex) || params.assetIndex < 0) {
        return { valid: false, error: 'Invalid asset index' };
      }

      // Validate size
      const size = parseFloat(String(params.size));
      if (isNaN(size) || size <= 0) return { valid: false, error: 'Invalid position size' };

      // Validate leverage (must be >=1 and reasonable)
      if (!Number.isFinite(params.leverage) || params.leverage < 1 || params.leverage > 100) {
        return { valid: false, error: 'Invalid leverage (must be between 1 and 100)' };
      }

      // No price validation needed for market orders

      // Validate market metadata (asset exists and leverage allowed)
      try {
        const metadata = await this.getMarketMetadata();
        const asset = metadata[params.assetIndex];
        if (!asset) return { valid: false, error: 'Asset not found' };
        if (params.leverage > asset.maxLeverage) {
          return { valid: false, error: `Leverage exceeds maximum (${asset.maxLeverage}x)` };
        }
      } catch (metaErr) {
        console.warn('Could not fetch metadata for validation:', metaErr);
        // allow to continue if metadata call fails (avoid blocking user)
      }

      return { valid: true };
    } catch (error) {
      console.error('Validation error:', error);
      return { valid: false, error: 'Validation failed' };
    }
  }

  /**
   * Open a position on Hyperliquid
   */
  async openPosition(params: PositionParams): Promise<PositionResult> {
    try {
      const { exchangeClient } = await this.initializeClients();

      // Validate params first
      const validation = await this.validatePosition(params);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
        // Get user balance using InfoClient;
        const { infoClient } = await this.initializeClients();
        const userAddress = await this.signer.getAddress();
        
        console.log('Fetching user details for address:', userAddress);
        const userState = await infoClient.clearinghouseState({ user: userAddress });
        console.log('User state:', JSON.stringify(userState));
        
        // Extract USDC balance from user state
        let usdcBalance = 0;
        if ((userState as any).withdrawable) {
          usdcBalance = parseFloat((userState as any).withdrawable);
          console.log('Found balance in withdrawable:', usdcBalance);
        } else if (userState.marginSummary && (userState.marginSummary as any).withdrawable) {
          usdcBalance = parseFloat((userState.marginSummary as any).withdrawable);
          console.log('Found balance in marginSummary.withdrawable:', usdcBalance);
        } else {
          console.log('Could not find balance in user state, using default');
          usdcBalance = 1000; // Default fallback
        }
        
        console.log(`User balance: ${usdcBalance} USDC`);      

      // Get market metadata first for szDecimals and validation
      const metadata = await this.getMarketMetadata();
      const asset = metadata[params.assetIndex];
      if (!asset) {
        return { success: false, error: 'Asset not found' };
      }

      // Calculate order size for target leverage
      const currentPriceStr = await this.getAssetPrice(params.assetIndex);
      const currentPrice = parseFloat(currentPriceStr);
      console.log(`Current price: ${currentPrice}`);
      const orderSize = this.calculateOrderSizeForLeverage(
        params.leverage,
        usdcBalance,
        currentPrice,
        asset.szDecimals
      );
      
      console.log(`Calculated order size for ${params.leverage}x leverage: ${orderSize}`);
      
      // Validate order size against minimum requirements
      const orderSizeNum = parseFloat(orderSize);
      const minOrderSize = parseFloat(asset.minOrderSize);
      if (orderSizeNum < minOrderSize) {
        return { success: false, error: `Order size too small. Minimum: ${asset.minOrderSize}` };
      }
      
      console.log(`Order size validation: ${orderSize} >= ${asset.minOrderSize} ✓`);
    console.log(`Current asset index: ${params.assetIndex}`);
      // Build market order with calculated size
      const order = {
        a: 3,    // asset index
        b: params.isLong,        // true = long/buy, false = short/sell
        p: Math.floor(currentPrice).toString(),               
        r: false,                // reduce-only (false = open new position)
        s: orderSize,            // calculated size for target leverage
        t: {limit: {tif: "FrontendMarket"}}
      };
  
      const orderParams = {
        orders: [order],
        grouping: 'na' as const,
      };

      console.log('Submitting order payload:', JSON.stringify(orderParams, null, 2));

      const response = await exchangeClient.order(orderParams as any);

      console.log('Hyperliquid response:', response);

      // Interpret response safely
      let orderId = 'unknown';
      if (response && response.status === 'ok' && response.response && response.response.data && Array.isArray(response.response.data.statuses)) {
        const status = response.response.data.statuses[0];
        if (status) {
          if ('resting' in status && status.resting && typeof status.resting.oid !== 'undefined') {
            orderId = String(status.resting.oid);
          } else if ('filled' in status && status.filled && typeof status.filled.oid !== 'undefined') {
            orderId = String(status.filled.oid);
          }
        }
       } else if (response && response.status !== 'ok') {
         // Provide helpful error when sdk returns an error field
         const sdkErr = response?.response?.data || JSON.stringify(response);
         return { success: false, error: `Exchange rejected order: ${String(sdkErr)}` };
       }

      return {
        success: true,
        orderId,
        txHash: undefined,
      };
    } catch (error) {
      console.error('Error opening position:', error);
      let message = 'Failed to open position';
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('insufficient') || msg.includes('balance')) message = 'Insufficient balance for position';
        else if (msg.includes('user rejected') || msg.includes('rejected')) message = 'Transaction was cancelled by user';
        else if (msg.includes('invalid order')) message = 'Invalid order parameters';
        else message = error.message;
      }
      return { success: false, error: message };
    }
  }

  /**
   * Close a position (simple market-style reduce order)
   */
  async closePosition(assetIndex: number, size: string): Promise<PositionResult> {
    try {
      const { exchangeClient } = await this.initializeClients();

      // Get current mid price to use for market-like close
      const currentPriceStr = await this.getAssetPrice(assetIndex);
      const currentPrice = parseFloat(currentPriceStr);
      if (isNaN(currentPrice) || currentPrice <= 0) {
        return { success: false, error: 'Unable to determine market price to close position' };
      }
      const closePrice = (currentPrice * 0.995).toFixed(2); // slightly better chance to fill

      const orderParams = {
        orders: [
          {
            a: assetIndex,
            b: false, // assume closing a long -> short to reduce
            p: closePrice,
            s: size,
            r: true, // reduce only
            t: { limit: { tif: 'Ioc' as const } }, // Immediate or cancel for closing
          },
        ],
        grouping: 'na' as const,
      };

      console.log('Submitting close order:', orderParams);
      const response = await exchangeClient.order(orderParams);
      console.log('Close response:', response);

      let orderId = 'unknown';
      if (response && response.status === 'ok' && response.response && response.response.data && Array.isArray(response.response.data.statuses)) {
        const status = response.response.data.statuses[0];
        if (status) {
          if ('resting' in status && status.resting && typeof status.resting.oid !== 'undefined') orderId = String(status.resting.oid);
          else if ('filled' in status && status.filled && typeof status.filled.oid !== 'undefined') orderId = String(status.filled.oid);
        }
      } else if (response && response.status !== 'ok') {
        return { success: false, error: `Exchange rejected close order: ${JSON.stringify(response)}` };
      }

      return { success: true, orderId, txHash: undefined };
    } catch (error) {
      console.error('Error closing position:', error);
      return { success: false, error: (error instanceof Error) ? error.message : 'Failed to close position' };
    }
  }

  /**
   * Placeholder for getUserPositions - to be implemented when SDK endpoint known
   */
  async getUserPositions(): Promise<any[]> {
    // SDK may provide userState or positions endpoint - implement when available
    return [];
  }

  /**
   * Check if the connected provider is on the expected network
   */
  async checkNetwork(): Promise<boolean> {
    try {
      const network = await this.provider.getNetwork();
      const expectedChainId = this.isTestnet ? 421614 : 42161; // 421614 Arbitrum Sepolia (testnet), 42161 Arbitrum (mainnet)
      const currentChainId = Number(network.chainId);
      console.log(`Current chain ID: ${currentChainId}, Expected: ${expectedChainId}`);
      return currentChainId === expectedChainId;
    } catch (error) {
      console.error('Network check error:', error);
      return false;
    }
  }

  /**
   * Attempt to switch the user's wallet network (frontend only)
   */
  async switchNetwork(): Promise<boolean> {
    try {
      const chainIdHex = this.isTestnet ? '0x66eee' : '0xa4b1'; // 421614 or 42161
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      // give wallet a moment
      await new Promise((res) => setTimeout(res, 800));
      return true;
    } catch (error) {
      console.error('Network switch error:', error);
      return false;
    }
  }
}
