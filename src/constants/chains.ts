export interface Chain {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export const CHAINS: Chain[] = [
  { 
    id: 1, 
    name: 'Ethereum', 
    shortName: 'ETH',
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io']
  },
  { 
    id: 42161, 
    name: 'Arbitrum', 
    shortName: 'ARB',
    logo: 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io']
  },
  { 
    id: 8453, 
    name: 'Base', 
    shortName: 'BASE',
    logo: 'https://assets.coingecko.com/coins/images/27505/large/lusd.png',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org']
  },
  { 
    id: 10, 
    name: 'Optimism', 
    shortName: 'OP',
    logo: 'https://assets.coingecko.com/coins/images/25244/large/Optimism.png',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io']
  }
];