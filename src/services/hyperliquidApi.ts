// Hyperliquid API service for fetching real-time market data
export interface HyperliquidFundingData {
  fundingRate: string;
  nextFundingTime: number;
  fundingIntervalHours: number;
}

export interface HyperliquidMarketData {
  [asset: string]: {
    [dex: string]: HyperliquidFundingData;
  };
}

export class HyperliquidApiService {
  private static readonly API_URL = 'https://api.hyperliquid.xyz/info';

  /**
   * Fetch predicted funding rates for all assets
   */
  static async getPredictedFundings(): Promise<HyperliquidMarketData> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'predictedFundings'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the API response into our market data structure
      const marketData: HyperliquidMarketData = {};
      
      data.forEach(([asset, dexData]: [string, [string, HyperliquidFundingData][]]) => {
        marketData[asset] = {};
        dexData.forEach(([dex, fundingData]) => {
          marketData[asset][dex] = fundingData;
        });
      });

      return marketData;
    } catch (error) {
      console.error('Error fetching Hyperliquid funding data:', error);
      throw error;
    }
  }

  /**
   * Get funding rates for specific assets (BTC, ETH)
   */
  static async getFundingRatesForAssets(assets: string[] = ['BTC', 'ETH']): Promise<{
    [asset: string]: {
      [dex: string]: {
        fundingRate: number;
        nextFundingTime: number;
        fundingIntervalHours: number;
        nextFundingInHours: number;
        isPositive: boolean;
        formattedRate: string;
      };
    };
  }> {
    try {
      const marketData = await this.getPredictedFundings();
      const result: any = {};

      assets.forEach(asset => {
        if (marketData[asset]) {
          result[asset] = {};
          Object.entries(marketData[asset]).forEach(([dex, data]) => {
            const fundingRate = parseFloat(data.fundingRate);
            const nextFundingInHours = Math.round((data.nextFundingTime - Date.now()) / (1000 * 60 * 60));
            
            result[asset][dex] = {
              fundingRate,
              nextFundingTime: data.nextFundingTime,
              fundingIntervalHours: data.fundingIntervalHours,
              nextFundingInHours,
              isPositive: fundingRate > 0,
              formattedRate: `${fundingRate > 0 ? '+' : ''}${(fundingRate * 100).toFixed(4)}%`
            };
          });
        }
      });

      return result;
    } catch (error) {
      console.error('Error processing funding rates:', error);
      throw error;
    }
  }

  /**
   * Get the best funding rates for each asset
   */
  static async getBestFundingRates(): Promise<{
    [asset: string]: {
      bestDex: string;
      bestRate: number;
      bestFormattedRate: string;
      allRates: Array<{
        dex: string;
        rate: number;
        formattedRate: string;
        isPositive: boolean;
      }>;
    };
  }> {
    try {
      const fundingData = await this.getFundingRatesForAssets();
      const result: any = {};

      Object.entries(fundingData).forEach(([asset, dexData]) => {
        const rates = Object.entries(dexData).map(([dex, data]) => ({
          dex,
          rate: data.fundingRate,
          formattedRate: data.formattedRate,
          isPositive: data.isPositive
        }));

        // Find the best (most negative) funding rate
        const bestRate = rates.reduce((best, current) => 
          current.rate < best.rate ? current : best
        );

        result[asset] = {
          bestDex: bestRate.dex,
          bestRate: bestRate.rate,
          bestFormattedRate: bestRate.formattedRate,
          allRates: rates
        };
      });

      return result;
    } catch (error) {
      console.error('Error getting best funding rates:', error);
      throw error;
    }
  }
}

// Utility function to format funding rate for display
export const formatFundingRate = (rate: number): string => {
  const percentage = rate * 100;
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(4)}%`;
};

// Utility function to get funding rate color class
export const getFundingRateColor = (rate: number): string => {
  if (rate > 0) {
    return 'text-red-400'; // Positive rate (longs pay shorts)
  } else if (rate < 0) {
    return 'text-green-400'; // Negative rate (shorts pay longs)
  } else {
    return 'text-gray-400'; // Neutral
  }
};

// Utility function to get funding rate background color
export const getFundingRateBgColor = (rate: number): string => {
  if (rate > 0) {
    return 'bg-red-500/20 border-red-500/30'; // Positive rate
  } else if (rate < 0) {
    return 'bg-green-500/20 border-green-500/30'; // Negative rate
  } else {
    return 'bg-gray-500/20 border-gray-500/30'; // Neutral
  }
};
