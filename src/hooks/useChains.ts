import { useMemo } from 'react';
import { SUPPORTED_CHAINS } from '../constants/chains';
import type { Chain } from '../types';

export const useChains = () => {
  const chains = useMemo(() => SUPPORTED_CHAINS, []);
  
  const getChainById = (chainId: number): Chain | undefined => {
    return chains.find(chain => chain.id === chainId);
  };
  
  const getAvailableChains = (excludeChainId?: number): Chain[] => {
    return chains.filter(chain => chain.id !== excludeChainId);
  };
  
  return {
    chains,
    getChainById,
    getAvailableChains,
  };
};
