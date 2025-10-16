// Aster API service for fetching real-time market data
export interface AsterFundingData {
  symbol: string;
  markPrice: string;
  indexPrice: string;
  estimatedSettlePrice: string;
  lastFundingRate: string;
  interestRate: string;
  nextFundingTime: number;
  time: number;
}

export interface AsterMarketData {
  [asset: string]: AsterFundingData;
}

export class AsterApiService {
  private static readonly API_URL = 'https://fapi.asterdex.com/fapi/v1/premiumIndex';

  /**
   * Fetch funding data for a specific asset
   */
  static async getFundingData(symbol: string): Promise<AsterFundingData> {
    try {
      const response = await fetch(`${this.API_URL}?symbol=${symbol}`, {
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
      console.error(`Error fetching Aster data for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get funding rates for multiple assets
   */
  static async getFundingRatesForAssets(assets: string[] = ['BTCUSDT', 'ETHUSDT']): Promise<{
    [asset: string]: {
      fundingRate: number;
      markPrice: number;
      indexPrice: number;
      nextFundingTime: number;
      nextFundingInHours: number;
      isPositive: boolean;
      formattedRate: string;
      symbol: string;
    };
  }> {
    try {
      const promises = assets.map(asset => this.getFundingData(asset));
      const results = await Promise.all(promises);
      
      const processedData: any = {};
      
      results.forEach((data, index) => {
        const asset = assets[index];
        const fundingRate = parseFloat(data.lastFundingRate);
        const nextFundingInHours = Math.round((data.nextFundingTime - Date.now()) / (1000 * 60 * 60));
        
        processedData[asset] = {
          fundingRate,
          markPrice: parseFloat(data.markPrice),
          indexPrice: parseFloat(data.indexPrice),
          nextFundingTime: data.nextFundingTime,
          nextFundingInHours,
          isPositive: fundingRate > 0,
          formattedRate: `${fundingRate > 0 ? '+' : ''}${(fundingRate * 100).toFixed(4)}%`,
          symbol: data.symbol
        };
      });

      return processedData;
    } catch (error) {
      console.error('Error processing Aster funding rates:', error);
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
      markPrice: number;
      indexPrice: number;
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
          markPrice: data.markPrice,
          indexPrice: data.indexPrice,
          nextFundingInHours: data.nextFundingInHours
        };
      });

      return result;
    } catch (error) {
      console.error('Error getting best Aster funding rates:', error);
      throw error;
    }
  }
}

// Utility function to format funding rate for display
export const formatAsterFundingRate = (rate: number): string => {
  const percentage = rate * 100;
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(4)}%`;
};

// Utility function to get funding rate color class
export const getAsterFundingRateColor = (rate: number): string => {
  if (rate > 0) {
    return 'text-red-400'; // Positive rate (longs pay shorts)
  } else if (rate < 0) {
    return 'text-green-400'; // Negative rate (shorts pay longs)
  } else {
    return 'text-gray-400'; // Neutral
  }
};

// Utility function to get funding rate background color
export const getAsterFundingRateBgColor = (rate: number): string => {
  if (rate > 0) {
    return 'bg-red-500/20 border-red-500/30'; // Positive rate
  } else if (rate < 0) {
    return 'bg-green-500/20 border-green-500/30'; // Negative rate
  } else {
    return 'bg-gray-500/20 border-gray-500/30'; // Neutral
  }
};
