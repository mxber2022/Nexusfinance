import {
    CHAIN_METADATA,
    MAINNET_CHAINS,
  } from '@avail-project/nexus-widgets';
  import type { Chain } from '../types';
  
  // Map Nexus SDK chain data to our Chain interface
  export const SUPPORTED_CHAINS: Chain[] = MAINNET_CHAINS.map(chainId => {
    const metadata = CHAIN_METADATA[chainId];
    return {
      id: chainId,
      name: metadata.name,
      shortName: metadata.shortName,
      logo: metadata.logo,
      nativeCurrency: {
        name: metadata.nativeCurrency.name,
        symbol: metadata.nativeCurrency.symbol,
        decimals: metadata.nativeCurrency.decimals
      },
      rpcUrls: metadata.rpcUrls || [],
      blockExplorerUrls: metadata.blockExplorerUrls || []
    };
  });
  
  // Chain ID constants for easy reference
  export const CHAIN_IDS = {
    ETHEREUM: 1,
    BASE: 8453,
    ARBITRUM: 42161,
    OPTIMISM: 10,
    POLYGON: 137,
    AVALANCHE: 43114,
    SCROLL: 534352,
    SOPHON: 50104,
    KAIA: 8217,
    BNB: 56,
    HYPEREVM: 999,
  } as const;