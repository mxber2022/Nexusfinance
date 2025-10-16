export interface DEXData {
  name: string;
  logo: string;
  fundingRate: number;
  liquidity: string;
  volume24h: string;
  openInterest: string;
  longShortRatio: string;
  maxLeverage: string;
  makerFee: string;
  takerFee: string;
  minOrderSize: string;
  tickSize: string;
  nextFunding: string;
  openInterestChange: string;
  volumeChange: string;
  liquidations24h: string;
  topTraders: string;
  avgPositionSize: string;
  isBestFunding: boolean;
  isBestLiquidity: boolean;
}

export interface Asset {
  symbol: string;
  name: string;
  description: string;
  logo: string;
  price: string;
  priceChange: string;
  color: string;
  borderColor: string;
  marketCap: string;
  dominance: string;
  volatility: string;
  dexes: {
    [key: string]: DEXData;
  };
}

export const MARKET_DATA: { [key: string]: Asset } = {
  bitcoin: {
    symbol: 'BTC',
    name: 'Bitcoin',
    description: 'Digital currency and payment system',
    logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    price: 'Loading...',
    priceChange: 'Loading...',
    color: 'from-orange-500/10 to-yellow-500/10',
    borderColor: 'border-orange-500/20',
    // Market data
    marketCap: 'Loading...',
    dominance: 'Loading...',
    volatility: 'Loading...',
    // DEX-specific data
    dexes: {
      hyperliquid: {
        name: 'Hyperliquid',
        logo: 'https://hyperliquid.gitbook.io/hyperliquid-docs/~gitbook/image?url=https%3A%2F%2F2356094849-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FyUdp569E6w18GdfqlGvJ%252Ficon%252FsIAjqhKKIUysM08ahKPh%252FHL-logoSwitchDISliStat.png%3Falt%3Dmedia%26token%3Da81fa25c-0510-4d97-87ff-3fb8944935b1&width=32&dpr=4&quality=100&sign=3e1219e3&sv=2',
        fundingRate: -0.0001,
        liquidity: '$1.2B',
        volume24h: '$680M',
        openInterest: '$450M',
        longShortRatio: '52.3% / 47.7%',
        maxLeverage: '100x',
        makerFee: '0.02%',
        takerFee: '0.05%',
        minOrderSize: '0.001 BTC',
        tickSize: '0.01',
        nextFunding: '2h 15m',
        openInterestChange: '+12.4%',
        volumeChange: '+8.7%',
        liquidations24h: '$25M',
        topTraders: '1,847',
        avgPositionSize: '$15,500',
        isBestFunding: true,
        isBestLiquidity: true
      },
      aster: {
        name: 'Aster',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/36341.png',
        fundingRate: 0.0002,
        liquidity: '$800M',
        volume24h: '$420M',
        openInterest: '$280M',
        longShortRatio: '48.1% / 51.9%',
        maxLeverage: '50x',
        makerFee: '0.025%',
        takerFee: '0.06%',
        minOrderSize: '0.01 BTC',
        tickSize: '0.1',
        nextFunding: '1h 45m',
        openInterestChange: '+8.9%',
        volumeChange: '+5.2%',
        liquidations24h: '$15M',
        topTraders: '1,123',
        avgPositionSize: '$9,750',
        isBestFunding: false,
        isBestLiquidity: false
      },
      lighter: {
        name: 'Lighter',
        logo: 'https://framerusercontent.com/images/k22lnUP5Ao1xIheAoknaPGmdjXk.svg?width=14&height=26',
        fundingRate: -0.0003,
        liquidity: '$400M',
        volume24h: '$200M',
        openInterest: '$120M',
        longShortRatio: '55.2% / 44.8%',
        maxLeverage: '75x',
        makerFee: '0.015%',
        takerFee: '0.04%',
        minOrderSize: '0.005 BTC',
        tickSize: '0.05',
        nextFunding: '3h 30m',
        openInterestChange: '+15.8%',
        volumeChange: '+12.3%',
        liquidations24h: '$5M',
        topTraders: '456',
        avgPositionSize: '$6,250',
        isBestFunding: true,
        isBestLiquidity: false
      }
    }
  },
  ethereum: {
    symbol: 'ETH', 
    name: 'Ethereum',
    description: 'Decentralized platform for smart contracts',
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    price: 'Loading...',
    priceChange: 'Loading...',
    color: 'from-blue-500/10 to-purple-500/10',
    borderColor: 'border-blue-500/20',
    // Market data
    marketCap: 'Loading...',
    dominance: 'Loading...',
    volatility: 'Loading...',
    // DEX-specific data
    dexes: {
      hyperliquid: {
        name: 'Hyperliquid',
        logo: 'https://hyperliquid.gitbook.io/hyperliquid-docs/~gitbook/image?url=https%3A%2F%2F2356094849-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FyUdp569E6w18GdfqlGvJ%252Ficon%252FsIAjqhKKIUysM08ahKPh%252FHL-logoSwitchDISliStat.png%3Falt%3Dmedia%26token%3Da81fa25c-0510-4d97-87ff-3fb8944935b1&width=32&dpr=4&quality=100&sign=3e1219e3&sv=2',
        fundingRate: 0.0003,
        liquidity: '$900M',
        volume24h: '$475M',
        openInterest: '$310M',
        longShortRatio: '48.1% / 51.9%',
        maxLeverage: '50x',
        makerFee: '0.025%',
        takerFee: '0.06%',
        minOrderSize: '0.01 ETH',
        tickSize: '0.1',
        nextFunding: '1h 45m',
        openInterestChange: '+8.9%',
        volumeChange: '+5.2%',
        liquidations24h: '$14M',
        topTraders: '961',
        avgPositionSize: '$4,375',
        isBestFunding: false,
        isBestLiquidity: true
      },
      aster: {
        name: 'Aster',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/36341.png',
        fundingRate: -0.0001,
        liquidity: '$600M',
        volume24h: '$300M',
        openInterest: '$200M',
        longShortRatio: '51.2% / 48.8%',
        maxLeverage: '40x',
        makerFee: '0.03%',
        takerFee: '0.07%',
        minOrderSize: '0.05 ETH',
        tickSize: '0.2',
        nextFunding: '2h 30m',
        openInterestChange: '+6.4%',
        volumeChange: '+3.8%',
        liquidations24h: '$8M',
        topTraders: '623',
        avgPositionSize: '$3,250',
        isBestFunding: true,
        isBestLiquidity: false
      },
      lighter: {
        name: 'Lighter',
        logo: 'https://framerusercontent.com/images/k22lnUP5Ao1xIheAoknaPGmdjXk.svg?width=14&height=26',
        fundingRate: 0.0001,
        liquidity: '$300M',
        volume24h: '$175M',
        openInterest: '$110M',
        longShortRatio: '49.8% / 50.2%',
        maxLeverage: '60x',
        makerFee: '0.02%',
        takerFee: '0.05%',
        minOrderSize: '0.02 ETH',
        tickSize: '0.1',
        nextFunding: '4h 15m',
        openInterestChange: '+11.2%',
        volumeChange: '+7.9%',
        liquidations24h: '$6M',
        topTraders: '339',
        avgPositionSize: '$2,875',
        isBestFunding: false,
        isBestLiquidity: false
      }
    }
  }
};
