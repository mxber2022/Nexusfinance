import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { GasRefuelPage } from './pages/GasRefuelPage';
import { FlowFiPage } from './pages/FlowFiPage';
import { PerpPortPage } from './pages/PerpPortPage';
import { AppKitProvider } from './providers/AppKitProvider';
import { NexusProvider, useNexus } from '@avail-project/nexus-widgets';
import { useAccount } from 'wagmi';

export type Step = 'home' | 'refuel' | 'flowfi' | 'perpport';

interface RefuelData {
  sourceChain: string;
  destinationChain: string;
  amount: string;
  txHash?: string;
}

// Manual SDK Initialization Component
function NexusInitializer() {
  const { initializeSdk, sdk, isSdkInitialized } = useNexus();
  const { isConnected, connector } = useAccount();

  const handleInitialize = async () => {
    try {
      // Get provider from connected wallet via AppKit/WalletConnect
      if (!connector) {
        console.warn('No wallet connector found');
        return;
      }

      const provider = await connector.getProvider();
      if (!provider) {
        console.warn('No provider found from wallet connector');
        return;
      }
      
      // Cast to EthereumProvider type for Nexus SDK
      await initializeSdk(provider as any); // Initializes both SDK and UI state

      // Now you can use SDK methods directly
      const balances = await sdk?.getUnifiedBalances();
      console.log('Nexus SDK initialized successfully!');
      console.log('Balances:', balances);
    } catch (error) {
      console.error('Failed to initialize Nexus SDK:', error);
    }
  };

  // Auto-initialize when wallet is connected
  useEffect(() => {
    if (isConnected && connector && !isSdkInitialized) {
      handleInitialize();
    }
  }, [isConnected, connector, isSdkInitialized]);

  return null; // This component doesn't render anything
}

function App() {
  // Initialize state based on current URL
  const getInitialStep = (): Step => {
    const path = window.location.pathname;
    console.log('Initial path check:', path);
    if (path === '/gasrefuel' || path === '/refuel') return 'refuel';
    if (path === '/flowfi' || path === '/yield') return 'flowfi';
    return 'home';
  };

  const [currentStep, setCurrentStep] = useState<Step>(getInitialStep);
  const [refuelData, setRefuelData] = useState<RefuelData>({
    sourceChain: '',
    destinationChain: '',
    amount: '',
    txHash: ''
  });

  // Update URL when step changes
  useEffect(() => {
    let path = '/';
    if (currentStep === 'refuel') path = '/gasrefuel';
    else if (currentStep === 'flowfi') path = '/flowfi';
    else if (currentStep === 'perpport') path = '/perpport';
    
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [currentStep]);

  // Check URL on every render to handle direct navigation
  useEffect(() => {
    const path = window.location.pathname;
    let expectedStep: Step = 'home';
    if (path === '/gasrefuel' || path === '/refuel') expectedStep = 'refuel';
    else if (path === '/flowfi' || path === '/yield') expectedStep = 'flowfi';
    else if (path === '/perpport') expectedStep = 'perpport';
    
    if (currentStep !== expectedStep) {
      console.log('URL mismatch - correcting step to:', expectedStep);
      setCurrentStep(expectedStep);
    }
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      console.log('Popstate - path:', path);
      if (path === '/gasrefuel' || path === '/refuel') {
        setCurrentStep('refuel');
      } else if (path === '/flowfi' || path === '/yield') {
        setCurrentStep('flowfi');
      } else if (path === '/perpport') {
        setCurrentStep('perpport');
      } else {
        setCurrentStep('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleGetStarted = () => {
    setCurrentStep('refuel');
  };

  const handleNavigateHome = () => {
    setCurrentStep('home');
  };

  const handleNavigateToRefuel = () => {
    setCurrentStep('refuel');
  };

  const handleNavigateToFlowFi = () => {
    setCurrentStep('flowfi');
  };

  const handleNavigateToPerpPort = () => {
    setCurrentStep('perpport');
  };

  const handleRefuelComplete = (txHash: string) => {
    setRefuelData(prev => ({
      ...prev,
      txHash
    }));
    // Keep user on refuel page to see success message
    // They can manually navigate back to home if desired
  };


  return (
    <NexusProvider
      config={{
        debug: false, // true to view debug logs
        network: 'mainnet', // "mainnet" (default) or "testnet"
      }}
    >
      <AppKitProvider>
        {/* Manual Nexus SDK Initialization */}
        <NexusInitializer />
        
        {/* Fixed Header - outside of scrolling container */}
          <Header 
            currentStep={currentStep} 
            onNavigateHome={handleNavigateHome}
            onNavigateToRefuel={handleNavigateToRefuel}
            onNavigateToFlowFi={handleNavigateToFlowFi}
            onNavigateToPerpPort={handleNavigateToPerpPort}
          />
        
        <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-gray-800/10 to-gray-700/10 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-gray-700/10 to-gray-600/10 rounded-full blur-xl translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-br from-gray-800/8 to-gray-700/8 rounded-full blur-lg -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10">
        {/* Progress Indicator - Right Side Vertical */}
        <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-40 hidden sm:block">
          <div className="flex flex-col items-center space-y-3 bg-black/20 backdrop-blur-2xl border border-white/15 rounded-full px-3 py-4 shadow-2xl ring-1 ring-white/5">
            {[
              { step: 'home', label: 'Home', icon: '🏠' },
              { step: 'refuel', label: 'Refuel', icon: '⛽' },
              { step: 'flowfi', label: 'Yield', icon: '💰' },
              { step: 'perpport', label: 'Perp', icon: '⚡' }
            ].map((item, index) => (
              <button
                key={item.step}
                onClick={() => setCurrentStep(item.step as Step)}
                className="flex flex-col items-center space-y-1 transition-colors duration-200 cursor-pointer group"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors duration-200 backdrop-blur-xl border ${
                  currentStep === item.step 
                    ? 'bg-white/90 text-black border-white/30 shadow-lg ring-2 ring-white/20' 
                    : 'bg-black/20 text-gray-300 group-hover:bg-black/30 border-white/10 group-hover:border-white/20'
                }`}>
                  {item.icon}
                </div>
                <span className={`text-xs font-medium transition-colors duration-200 text-center leading-tight group-hover:text-white ${
                  currentStep === item.step ? 'text-white' : 'text-gray-400'
                }`}>
                  {item.label}
                </span>
                {index < 3 && (
                  <div className="w-0.5 h-4 bg-gray-600/50" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <main className="pt-32 pb-8">
          <div className="transition-all duration-500 ease-in-out">
            {currentStep === 'home' && (
              <div className="animate-fadeIn">
                <HomePage onGetStarted={handleGetStarted} onNavigateToFlowFi={handleNavigateToFlowFi} onNavigateToPerpPort={handleNavigateToPerpPort} />
              </div>
            )}
            
            {currentStep === 'refuel' && (
              <div className="animate-slideInRight">
                <GasRefuelPage onRefuelComplete={handleRefuelComplete} />
              </div>
            )}
            
            {currentStep === 'flowfi' && (
              <div className="animate-slideInRight">
                <FlowFiPage onNavigateBack={handleNavigateHome} />
              </div>
            )}
            
            {currentStep === 'perpport' && (
              <div className="animate-slideInRight">
                <PerpPortPage />
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
      </div>
      </AppKitProvider>
    </NexusProvider>
  );
}

export default App;