import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AppKitProvider } from './providers/AppKitProvider';

// Polyfill for Node.js globals in browser
import { Buffer } from 'buffer';
import process from 'process';

// Make Buffer and process available globally
(window as any).Buffer = Buffer;
(window as any).process = process;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppKitProvider>
      <App />
    </AppKitProvider>
  </StrictMode>
);
