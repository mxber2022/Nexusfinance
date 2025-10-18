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

// Position opening types
export interface PositionParams {
  assetIndex: number;
  isLong: boolean;
  size: string;
  leverage: number;
  isTestnet?: boolean;
}

export interface PositionResult {
  success: boolean;
  txHash?: string;
  error?: string;
  orderId?: string;
}

export interface MarketMetadata {
  assetIndex: number;
  symbol: string;
  name: string;
  maxLeverage: number;
  minOrderSize: string;
  tickSize: string;
}

export interface PositionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assetSymbol: string;
  assetName: string;
  currentPrice: string;
  positionType: 'long' | 'short'; // Pass the selected position type
  onPositionOpen: (params: PositionParams) => Promise<PositionResult>;
  isOpening: boolean;
  error: string | null;
  onClearError: () => void;
}
