import React, { useState } from 'react';
import { Fuel, Home, Maximize, Minimize, TrendingUp, Zap } from 'lucide-react';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import type { Step } from '../../App';

interface HeaderProps {
  currentStep: Step;
  onNavigateHome?: () => void;
  onNavigateToRefuel?: () => void;
  onNavigateToFlowFi?: () => void;
  onNavigateToPerpPort?: () => void;
}

export function Header({ currentStep, onNavigateHome, onNavigateToRefuel, onNavigateToFlowFi, onNavigateToPerpPort }: HeaderProps) {
  const { open } = useAppKit();
  const { address: appKitAddress } = useAppKitAccount();
  const { address, isConnected, status } = useAccount();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Use AppKit address if available, otherwise use Wagmi address
  const connectedAddress = appKitAddress || address;
  const isWalletConnected = connectedAddress ? true : isConnected;

  // Debug logging
  console.log('Header - Connection status:', { 
    appKitAddress, 
    wagmiAddress: address, 
    connectedAddress,
    isConnected, 
    isWalletConnected,
    status 
  });

  const handleConnectWallet = () => {
    open();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 lg:px-8">
      <nav className="w-full max-w-7xl">
      <div className="bg-black/10 backdrop-blur-2xl border border-white/15 rounded-full px-8 py-2 shadow-2xl ring-1 ring-white/5">
        <div className="flex items-center justify-between">
          {/* Left Section - Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-black border border-gray-600 rounded-lg shadow-inner">
              <div className="w-3 h-3 bg-gray-800 rounded-sm border border-gray-700"></div>
            </div>
            <div>
              <div className="text-base font-medium text-white">
                NexusFinance
              </div>
              <div className="text-xs text-gray-400">Cross-Chain DeFi Hub</div>
            </div>
          </div>


          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            {/* Home Button */}
            <button
              onClick={onNavigateHome}
              className={`p-2 text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-xl border border-gray-700/50 rounded-full transition-all duration-300 ${
                currentStep === 'home' ? 'opacity-50 cursor-default' : ''
              }`}
              disabled={currentStep === 'home'}
            >
              <Home className="h-4 w-4" />
            </button>

            {/* Refuel Button */}
            <button
              onClick={onNavigateToRefuel}
              className={`p-2 text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-xl border border-gray-700/50 rounded-full transition-all duration-300 ${
                currentStep === 'refuel' ? 'opacity-50 cursor-default' : ''
              }`}
              disabled={currentStep === 'refuel'}
              title="Gas Refuel"
            >
              <Fuel className="h-4 w-4" />
            </button>

            {/* FlowFi Button */}
            <button
              onClick={onNavigateToFlowFi}
              className={`p-2 text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-xl border border-gray-700/50 rounded-full transition-all duration-300 ${
                currentStep === 'flowfi' ? 'opacity-50 cursor-default' : ''
              }`}
              disabled={currentStep === 'flowfi'}
              title="NexusFinance Yield Optimization"
            >
              <TrendingUp className="h-4 w-4" />
            </button>

            {/* PerpPort Button */}
            <button
              onClick={onNavigateToPerpPort}
              className={`p-2 text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-xl border border-gray-700/50 rounded-full transition-all duration-300 ${
                currentStep === 'perpport' ? 'opacity-50 cursor-default' : ''
              }`}
              disabled={currentStep === 'perpport'}
              title="PerpPort - Cross-Chain Perpetual Deposits"
            >
              <Zap className="h-4 w-4" />
            </button>

            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-xl border border-gray-700/50 rounded-full transition-all duration-300"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
            
            {/* Connect Wallet Button */}
            <button 
              onClick={handleConnectWallet}
              className="flex items-center space-x-2 bg-gray-800/60 hover:bg-gray-700/60 text-gray-200 hover:text-white backdrop-blur-xl border border-gray-700/50 rounded-full px-3 py-1.5 transition-all duration-300 text-sm font-medium"
            >
              <div className={`w-2 h-2 rounded-full ${isWalletConnected ? 'bg-green-500 animate-connect-pulse' : 'bg-gray-500 animate-connect-flash'}`}></div>
              <span>{isWalletConnected ? formatAddress(connectedAddress!) : 'Connect'}</span>
            </button>
          </div>
        </div>
      </div>
      </nav>
    </div>
  );
}