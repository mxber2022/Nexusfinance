// Shared types across the application

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

export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  icon: string;
  coingeckoId: string;
  isNative?: boolean;
  contractAddress?: string;
  chainId: number;
}

export interface TokenBalance {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
}

export interface ChainSelectorProps {
  chains: Chain[];
  selectedChain: Chain;
  onChainSelect: (chain: Chain) => void;
  balance?: TokenBalance;
}

export interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  balance?: TokenBalance;
  getTokenBalance?: (token: Token) => TokenBalance | undefined;
}

export interface GasRefuelPageProps {
  onRefuelComplete?: (txHash: string) => void;
}

export interface FlowFiPageProps {
  onNavigateBack?: () => void;
}

export interface RefuelData {
  txHash: string;
  amount: string;
  sourceChain: string;
  destinationChain: string;
  timestamp: number;
}
