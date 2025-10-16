// Reya API service for fetching real-time market data
export interface ReyaMarketData {
  symbol: string;
  fundingRate: string;
  markPrice?: string;
  indexPrice?: string;
  openInterest?: string;
  volume24h?: string;
  nextFundingTime?: number;
}

export interface ReyaApiResponse {
  [key: string]: ReyaMarketData;
}

export class ReyaApiService {
  private static readonly API_URL = 'https://api.reya.xyz/v2/markets/summary';

  /**
   * Fetch all market data from Reya
   */
  static async getAllMarkets(): Promise<ReyaMarketData[]> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Reya market data:', error);
      throw error;
    }
  }

  /**
   * Get funding rates for specific assets (BTC, ETH)
   */
  static async getFundingRatesForAssets(assets: string[] = ['BTC', 'ETH']): Promise<{
    [asset: string]: {
      fundingRate: number;
      nextFundingTime: number;
      nextFundingInHours: number;
      isPositive: boolean;
      formattedRate: string;
      symbol: string;
    };
  }> {
    try {
      const allMarkets = await this.getAllMarkets();
      const result: any = {};
      
      // Map asset symbols to Reya symbols
      const symbolMap: { [key: string]: string } = {
        'BTC': 'BTCRUSDPERP',
        'ETH': 'ETHRUSDPERP'
      };

      assets.forEach(asset => {
        const reyaSymbol = symbolMap[asset];
        const marketData = allMarkets.find(market => market.symbol === reyaSymbol);
        
        if (marketData) {
          const fundingRate = parseFloat(marketData.fundingRate);
          const nextFundingTime = marketData.nextFundingTime || (Date.now() + 8 * 60 * 60 * 1000); // Default 8 hours
          const nextFundingInHours = Math.round((nextFundingTime - Date.now()) / (1000 * 60 * 60));
          
          result[asset] = {
            fundingRate,
            nextFundingTime,
            nextFundingInHours,
            isPositive: fundingRate > 0,
            formattedRate: `${fundingRate > 0 ? '+' : ''}${(fundingRate * 100).toFixed(4)}%`,
            symbol: marketData.symbol
          };
        }
      });

      return result;
    } catch (error) {
      console.error('Error processing Reya funding rates:', error);
      throw error;
    }
  }

  /**
   * Get the best funding rates across all assets
   */
  static async getBestFundingRates(): Promise<{
    [asset: string]: {
      bestRate: number;
      bestFormattedRate: string;
      nextFundingInHours: number;
    };
  }> {
    try {
      const fundingData = await this.getFundingRatesForAssets();
      const result: any = {};

      Object.entries(fundingData).forEach(([asset, data]) => {
        result[asset] = {
          bestRate: data.fundingRate,
          bestFormattedRate: data.formattedRate,
          nextFundingInHours: data.nextFundingInHours
        };
      });

      return result;
    } catch (error) {
      console.error('Error getting best Reya funding rates:', error);
      throw error;
    }
  }
}

// Utility function to format funding rate for display
export const formatReyaFundingRate = (rate: number): string => {
  const percentage = rate * 100;
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(4)}%`;
};

// Utility function to get funding rate color class
export const getReyaFundingRateColor = (rate: number): string => {
  if (rate > 0) {
    return 'text-red-400'; // Positive rate (longs pay shorts)
  } else if (rate < 0) {
    return 'text-green-400'; // Negative rate (shorts pay longs)
  } else {
    return 'text-gray-400'; // Neutral
  }
};

// Utility function to get funding rate background color
export const getReyaFundingRateBgColor = (rate: number): string => {
  if (rate > 0) {
    return 'bg-red-500/20 border-red-500/30'; // Positive rate
  } else if (rate < 0) {
    return 'bg-green-500/20 border-green-500/30'; // Negative rate
  } else {
    return 'bg-gray-500/20 border-gray-500/30'; // Neutral
  }
};
