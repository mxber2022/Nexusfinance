import {
  TOKEN_METADATA,
  TOKEN_CONTRACT_ADDRESSES,
  MAINNET_CHAINS,
} from '@avail-project/nexus-widgets';
import type { Token } from '../types';

// Map Nexus SDK token data to our Token interface
// Create tokens for each chain that supports them
export const SUPPORTED_TOKENS: Token[] = Object.entries(TOKEN_METADATA).flatMap(([tokenKey, metadata]) => {
  const tokens: Token[] = [];
  
  // For each chain, check if this token exists
  MAINNET_CHAINS.forEach(chainId => {
    const contractAddress = TOKEN_CONTRACT_ADDRESSES[tokenKey]?.[chainId];
    if (contractAddress) {
      tokens.push({
        symbol: metadata.symbol,
        name: metadata.name,
        decimals: metadata.decimals,
        icon: metadata.icon,
        coingeckoId: metadata.coingeckoId,
        isNative: metadata.isNative,
        contractAddress: contractAddress,
        chainId: chainId,
      });
    }
  });
  
  return tokens;
});

// Create a comprehensive token list that includes native tokens for all chains
export const getAllTokensForChains = (chains: any[]): Token[] => {
  const allTokens: Token[] = [];
  
  // Add all supported tokens from Nexus SDK
  allTokens.push(...SUPPORTED_TOKENS);
  
  // Add native tokens for each chain
  chains.forEach(chain => {
    // Use a proper icon for native tokens based on the chain
    const getNativeTokenIcon = (chainId: number) => {
      switch (chainId) {
        case 1: return 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png';
        case 42161: return 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png';
        case 137: return 'https://coin-images.coingecko.com/coins/images/4713/large/matic-token-icon.png';
        case 43114: return 'https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle.png';
        case 56: return 'https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png';
        case 8453: return 'https://coin-images.coingecko.com/coins/images/27547/large/bnb.png';
        default: return 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png';
      }
    };

    const nativeToken = {
      symbol: chain.nativeCurrency.symbol,
      name: chain.nativeCurrency.name,
      decimals: chain.nativeCurrency.decimals,
      icon: getNativeTokenIcon(chain.id),
      coingeckoId: '',
      isNative: true,
      contractAddress: undefined,
      chainId: chain.id,
    };
    
    // Only add if not already present
    const exists = allTokens.some(token => 
      token.symbol === nativeToken.symbol && token.chainId === nativeToken.chainId
    );
    
    if (!exists) {
      allTokens.push(nativeToken);
    }
  });
  
  console.log('getAllTokensForChains:', {
    totalTokens: allTokens.length,
    chains: chains.map(c => ({ id: c.id, name: c.name })),
    tokensByChain: chains.map(chain => ({
      chainId: chain.id,
      chainName: chain.name,
      tokens: allTokens.filter(t => t.chainId === chain.id).map(t => ({
        symbol: t.symbol,
        isNative: t.isNative,
        contractAddress: t.contractAddress,
      })),
    })),
  });
  
  return allTokens;
};

// Add native tokens for each chain
export const getNativeTokensForChains = (chains: any[]) => {
  return chains.map(chain => ({
    symbol: chain.nativeCurrency.symbol,
    name: chain.nativeCurrency.name,
    decimals: chain.nativeCurrency.decimals,
    icon: chain.logo,
    coingeckoId: '',
    isNative: true,
    contractAddress: undefined,
    chainId: chain.id,
  }));
};

// Token symbols for easy reference
export const TOKEN_SYMBOLS = {
  ETH: 'ETH',
  USDC: 'USDC',
  USDT: 'USDT',
  DAI: 'DAI',
  WETH: 'WETH',
  WBTC: 'WBTC',
  AVAX: 'AVAX',
  MATIC: 'MATIC',
  BNB: 'BNB',
} as const;

// Best gas tokens for each chain (native tokens are usually best for gas)
export const BEST_GAS_TOKENS: Record<number, string> = {
  1: 'ETH',        // Ethereum
  137: 'MATIC',    // Polygon
  56: 'BNB',       // BNB Smart Chain
  42161: 'ETH',    // Arbitrum
  10: 'ETH',       // Optimism
  250: 'FTM',      // Fantom
  43114: 'AVAX',   // Avalanche
  25: 'CRO',       // Cronos
  100: 'XDAI',     // Gnosis
  1284: 'GLMR',    // Moonbeam
  1285: 'MOVR',    // Moonriver
  2222: 'KAVA',    // Kava
  9001: 'EVMOS',   // Evmos
  7700: 'CORE',    // CORE
  2000: 'DOGE',    // Dogechain
  5000: 'MANTLE',  // Mantle
  534352: 'ETH',   // Scroll
  59144: 'ETH',    // Linea
  8453: 'ETH',     // Base
  81457: 'BLAST',  // Blast
  7777777: 'ETH',  // Zora
  34443: 'MODE',   // Mode
  204: 'OPBNB',    // opBNB
  324: 'ETH',      // zkSync Era
  1101: 'ETH',     // Polygon zkEVM
  169: 'MNT',      // Manta
  148: 'SHIB',     // Shibarium
} as const;

// Get the best gas token symbol for a given chain
export const getBestGasToken = (chainId: number): string => {
  return BEST_GAS_TOKENS[chainId] || 'ETH'; // Default to ETH if chain not found
};
