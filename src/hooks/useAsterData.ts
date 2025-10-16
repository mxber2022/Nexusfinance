import { useState, useEffect, useCallback } from 'react';
import { AsterApiService } from '../services/asterApi';

export interface UseAsterDataReturn {
  fundingData: {
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
  };
  bestRates: {
    [asset: string]: {
      bestRate: number;
      bestFormattedRate: string;
      markPrice: number;
      indexPrice: number;
      nextFundingInHours: number;
    };
  };
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
}

export const useAsterData = (): UseAsterDataReturn => {
  const [fundingData, setFundingData] = useState<{
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
  }>({});
  
  const [bestRates, setBestRates] = useState<{
    [asset: string]: {
      bestRate: number;
      bestFormattedRate: string;
      markPrice: number;
      indexPrice: number;
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
      console.log('Fetching Aster funding data...');
      
      // Fetch funding rates for BTC and ETH (using USDT pairs)
      const fundingRates = await AsterApiService.getFundingRatesForAssets(['BTCUSDT', 'ETHUSDT']);
      setFundingData(fundingRates);
      
      // Fetch best rates
      const bestFundingRates = await AsterApiService.getBestFundingRates();
      setBestRates(bestFundingRates);
      
      setLastUpdated(new Date());
      console.log('Aster data fetched successfully:', { fundingRates, bestFundingRates });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Aster data';
      setError(errorMessage);
      console.error('Error fetching Aster data:', err);
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
