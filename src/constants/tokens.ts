export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
  chainId?: number;
}

export const TOKENS: Token[] = [
  { 
    symbol: 'ETH', 
    name: 'Ethereum', 
    decimals: 18, 
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' 
  },
  { 
    symbol: 'USDC', 
    name: 'USD Coin', 
    decimals: 6, 
    logo: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png' 
  },
  { 
    symbol: 'USDT', 
    name: 'Tether', 
    decimals: 6, 
    logo: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' 
  }
];

// Utility function to get all tokens for specific chains
export const getAllTokensForChains = (chains: any[]): Token[] => {
  // For now, return the base tokens for all chains
  // In a real implementation, this would filter tokens by chain support
  return TOKENS.map(token => ({
    ...token,
    chainId: chains[0]?.id || 1 // Default to Ethereum if no chains provided
  }));
};

// Utility function to get the best gas token for a chain
export const getBestGasToken = (chainId: number): Token => {
  // For most chains, ETH is the native gas token
  // For specific chains like Polygon, you might return MATIC
  return {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    chainId
  };
};