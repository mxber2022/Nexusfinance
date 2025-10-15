import React, { useState } from 'react';
import { ChevronDown, Check, Wifi, WifiOff } from 'lucide-react';

interface NetworkSelectorProps {
  currentNetwork: string;
  onNetworkChange: (network: string) => void;
}

const NETWORKS = {
  horizon: {
    name: 'Horizon Testnet',
    chainId: 845320009,
    color: 'from-blue-500 to-cyan-500',
    status: 'Active',
    icon: Wifi
  },
  celoSepolia: {
    name: 'Celo Sepolia',
    chainId: 11142220,
    color: 'from-green-500 to-emerald-500',
    status: 'Available',
    icon: Wifi
  },
  ethereumSepolia: {
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    color: 'from-purple-500 to-violet-500',
    status: 'Available',
    icon: Wifi
  },
  kadenaTestnet: {
    name: 'Kadena Testnet',
    chainId: 222000222,
    color: 'from-orange-500 to-red-500',
    status: 'Available',
    icon: Wifi
  }
};

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  currentNetwork,
  onNetworkChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentNetworkInfo = NETWORKS[currentNetwork as keyof typeof NETWORKS];
  const CurrentIcon = currentNetworkInfo.icon;

  return (
    <div className="relative">
      {/* Network Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl px-4 py-3 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 group"
      >
        {/* Subtle background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.03)_0%,transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-black/40 border border-white/10 rounded-xl shadow-inner group-hover:scale-105 transition-transform duration-300">
            <CurrentIcon className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-100 group-hover:text-white transition-colors duration-300">
              {currentNetworkInfo.name}
            </div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              Chain ID: {currentNetworkInfo.chainId}
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-black/40 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden ring-1 ring-white/5">
          {/* Subtle background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.03)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-xl"></div>
          
          <div className="relative z-10 p-2">
            {Object.entries(NETWORKS).map(([key, network]) => {
              const NetworkIcon = network.icon;
              const isSelected = currentNetwork === key;
              
              return (
                <button
                  key={key}
                  onClick={() => {
                    onNetworkChange(key);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group ${
                    isSelected 
                      ? 'bg-emerald-500/10 border border-emerald-500/20' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br ${network.color} rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      <NetworkIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-100 group-hover:text-white transition-colors duration-300">
                        {network.name}
                      </div>
                      <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        Chain ID: {network.chainId}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      network.status === 'Active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {network.status}
                    </span>
                    {isSelected && (
                      <div className="flex items-center justify-center w-6 h-6 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
