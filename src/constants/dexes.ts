export interface DEX {
  id: string;
  name: string;
  logo: string;
  description: string;
  supportedChains: string[];
  depositContract: string;
  color: string;
}

export const DEXES: DEX[] = [
  {
    id: 'hyperliquid',
    name: 'Hyperliquid',
    logo: 'https://hyperliquid.gitbook.io/hyperliquid-docs/~gitbook/image?url=https%3A%2F%2F2356094849-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FyUdp569E6w18GdfqlGvJ%252Ficon%252FsIAjqhKKIUysM08ahKPh%252FHL-logoSwitchDISliStat.png%3Falt%3Dmedia%26token%3Da81fa25c-0510-4d97-87ff-3fb8944935b1&width=32&dpr=4&quality=100&sign=3e1219e3&sv=2',
    description: 'Decentralized perpetual exchange',
    supportedChains: ['Ethereum', 'Arbitrum', 'Base', 'Optimism'],
    depositContract: '0x...', // Placeholder
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'aster',
    name: 'Aster',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/36341.png',
    description: 'Cross-chain perpetual protocol',
    supportedChains: ['Ethereum', 'Arbitrum', 'Base'],
    depositContract: '0x...', // Placeholder
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'lighter',
    name: 'Lighter',
    logo: 'https://framerusercontent.com/images/k22lnUP5Ao1xIheAoknaPGmdjXk.svg?width=14&height=26',
    description: 'Coming Soon',
    supportedChains: ['Ethereum', 'Arbitrum'],
    depositContract: '0x...', // Placeholder
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'reya',
    name: 'Reya',
    logo: 'https://cdn.prod.website-files.com/66b5e4e47712e879f0c5ef1b/686bcf104a9c1d2d2c69c5da_r.svg',
    description: 'Cross-chain perpetual protocol',
    supportedChains: ['Ethereum', 'Arbitrum', 'Base'],
    depositContract: '0x...', // Placeholder
    color: 'from-indigo-500 to-purple-500'
  }
];
