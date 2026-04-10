import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';
import App from './App.jsx';
import { wagmiConfig } from './wagmiConfig.js';

const queryClient = new QueryClient();

const rainbowTheme = darkTheme({
  accentColor:          '#FFD700',
  accentColorForeground: '#000000',
  borderRadius:          'medium',
  fontStack:             'system',
  overlayBlur:           'small',
});

// Override a few more tokens to fit the existing dark palette
rainbowTheme.colors.modalBackground        = '#0f0f1e';
rainbowTheme.colors.profileForeground      = '#1a1a2e';
rainbowTheme.colors.connectButtonBackground = '#1a1a2e';
rainbowTheme.colors.connectButtonText       = '#FFD700';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowTheme} coolMode>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
