import { useMemo } from 'react';
import { getAllTokensForChains } from '../constants/tokens';
import type { Token } from '../types';

export const useTokens = (chains?: any[]) => {
  const tokens = useMemo(() => {
    if (!chains || chains.length === 0) {
      return [];
    }
    
    return getAllTokensForChains(chains);
  }, [chains]);
  
  const getTokensByChain = (chainId: number): Token[] => {
    return tokens.filter(token => token.chainId === chainId);
  };
  
  const getTokenBySymbol = (symbol: string, chainId?: number): Token | undefined => {
    return tokens.find(token => 
      token.symbol === symbol && 
      (chainId ? token.chainId === chainId : true)
    );
  };
  
  const getAvailableTokens = (excludeToken?: Token): Token[] => {
    return tokens.filter(token => 
      !excludeToken || 
      token.symbol !== excludeToken.symbol || 
      token.chainId !== excludeToken.chainId
    );
  };
  
  return {
    tokens,
    getTokensByChain,
    getTokenBySymbol,
    getAvailableTokens,
  };
};
