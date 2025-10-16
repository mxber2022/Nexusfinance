import { useState, useEffect, useCallback } from 'react';
import { HyperliquidApiService } from '../services/hyperliquidApi';

export interface UseHyperliquidDataReturn {
  fundingData: {
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
  };
  bestRates: {
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
  };
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
}

export const useHyperliquidData = (): UseHyperliquidDataReturn => {
  const [fundingData, setFundingData] = useState<{
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
  }>({});
  
  const [bestRates, setBestRates] = useState<{
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
  }>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching Hyperliquid funding data...');
      
      // Fetch funding rates for BTC and ETH
      const fundingRates = await HyperliquidApiService.getFundingRatesForAssets(['BTC', 'ETH']);
      setFundingData(fundingRates);
      
      // Fetch best rates
      const bestFundingRates = await HyperliquidApiService.getBestFundingRates();
      setBestRates(bestFundingRates);
      
      setLastUpdated(new Date());
      console.log('Hyperliquid data fetched successfully:', { fundingRates, bestFundingRates });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Hyperliquid data';
      setError(errorMessage);
      console.error('Error fetching Hyperliquid data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    fundingData,
    bestRates,
    isLoading,
    error,
    lastUpdated,
    refreshData
  };
};
