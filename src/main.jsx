import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import { wagmiConfig } from './web3/wagmi';
import App from './App';
import './index.css';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 2 },
  },
});

const apiKey = (import.meta.env.VITE_ONCHAINKIT_API_KEY ?? '').trim() || undefined;

ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <OnchainKitProvider
        apiKey={apiKey}
        chain={base}
        config={{
          appearance: { name: 'NΞØ Smart Factory', mode: 'dark' },
          wallet: { display: 'modal' },
        }}
      >
        <App />
      </OnchainKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
