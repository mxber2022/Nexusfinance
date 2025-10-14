import { useNexus } from '@avail-project/nexus-widgets';
import { useEffect, useState } from 'react';
import type { Token, TokenBalance } from '../types';

interface UseTokenBalancesProps {
  address: `0x${string}` | undefined;
  chainId: number;
  tokens: Token[];
}

interface UseTokenBalancesReturn {
  balances: Record<string, TokenBalance>;
  getTokenBalance: (token: Token) => TokenBalance | undefined;
  isLoading: boolean;
  error: Error | null;
}

interface UserAsset {
  symbol: string;
  balance: string;
  balanceInFiat: number;
  decimals: number;
  breakdown: {
    balance: string;
    balanceInFiat: number;
    chain: {
      id: number;
      logo: string;
      name: string;
    };
    contractAddress: `0x${string}`;
    decimals: number;
    isNative?: boolean;
  }[];
}

export const useTokenBalances = ({ 
  address, 
  chainId, 
  tokens 
}: UseTokenBalancesProps): UseTokenBalancesReturn => {
  const { sdk, isSdkInitialized } = useNexus();
  const [balances, setBalances] = useState<Record<string, TokenBalance>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUnifiedBalances = async () => {
      if (!sdk || !isSdkInitialized || !address) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Get all unified balances
        const allBalances = await sdk.getUnifiedBalances();

        // Convert to our format
        const newBalances: Record<string, TokenBalance> = {};
        
        allBalances.forEach((asset) => {
          const { symbol, balance, decimals } = asset;
          
          // Find the breakdown for the current chain
          const chainBreakdown = asset.breakdown.find(
            (breakdown) => breakdown.chain.id === chainId
          );
          
          if (chainBreakdown) {
            const key = `${symbol}-${chainId}`;
            newBalances[key] = {
              formatted: chainBreakdown.balance,
              symbol: symbol,
              decimals: chainBreakdown.decimals,
              value: BigInt(Math.floor(parseFloat(chainBreakdown.balance) * Math.pow(10, chainBreakdown.decimals))),
            };
          }
        });

        setBalances(newBalances);
      } catch (err) {
        console.error('Error fetching unified balances:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch balances'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnifiedBalances();
  }, [sdk, isSdkInitialized, address, chainId]);

  const getTokenBalance = (token: Token): TokenBalance | undefined => {
    if (!token) return undefined;
    const key = `${token.symbol}-${token.chainId}`;
    const balance = balances[key];
    
    return balance;
  };

  return {
    balances,
    getTokenBalance,
    isLoading,
    error,
  };
};