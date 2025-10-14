import React from 'react'
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, base, optimism, polygon, avalanche, bsc, scroll } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://dashboard.reown.com
const projectId = '59198889d7df78b39ea70d871d0ec131'

// 2. Create a metadata object - optional
const metadata = {
  name: 'Nexusfinance',
  description: 'DEFI GOD',
  url: 'https://nexusfinance.fun',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}


// 3. Set the networks - Standard AppKit networks
const networks = [
  mainnet,           // Ethereum (1)
  arbitrum,          // Arbitrum (42161)
  base,              // Base (8453)
  optimism,          // Optimism (10)
  polygon,           // Polygon (137)
  avalanche,         // Avalanche (43114)
  bsc,               // BNB Smart Chain (56)
  scroll
]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// 5. Create modal - this initializes the AppKit but doesn't open the modal
createAppKit({
  adapters: [wagmiAdapter],
  //@ts-ignore
  networks,
  projectId,
  metadata,
  features: {
    analytics: true
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#000000',
    '--w3m-color-mix-strength': 40
  }
})

interface AppKitProviderProps {
  children: React.ReactNode;
}

export function AppKitProvider({ children }: AppKitProviderProps) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}