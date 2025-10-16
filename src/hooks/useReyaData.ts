import { useState, useEffect, useCallback } from 'react';
import { ReyaApiService } from '../services/reyaApi';

export interface UseReyaDataReturn {
  fundingData: {
    [asset: string]: {
      fundingRate: number;
      nextFundingTime: number;
      nextFundingInHours: number;
      isPositive: boolean;
      formattedRate: string;
      symbol: string;
    };
  };
  bestRates: {
    [asset: string]: {
      bestRate: number;
      bestFormattedRate: string;
      nextFundingInHours: number;
    };
  };
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
}

export const useReyaData = (): UseReyaDataReturn => {
  const [fundingData, setFundingData] = useState<{
    [asset: string]: {
      fundingRate: number;
      nextFundingTime: number;
      nextFundingInHours: number;
      isPositive: boolean;
      formattedRate: string;
      symbol: string;
    };
  }>({});
  
  const [bestRates, setBestRates] = useState<{
    [asset: string]: {
      bestRate: number;
      bestFormattedRate: string;
      nextFundingInHours: number;
    };
  }>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching Reya funding data...');
      
      // Fetch funding rates for BTC and ETH
      const fundingRates = await ReyaApiService.getFundingRatesForAssets(['BTC', 'ETH']);
      setFundingData(fundingRates);
      
      // Fetch best rates
      const bestFundingRates = await ReyaApiService.getBestFundingRates();
      setBestRates(bestFundingRates);
      
      setLastUpdated(new Date());
      console.log('Reya data fetched successfully:', { fundingRates, bestFundingRates });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Reya data';
      setError(errorMessage);
      console.error('Error fetching Reya data:', err);
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
