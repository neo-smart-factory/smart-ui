import { http, createConfig } from 'wagmi';
import { base, polygon, arbitrum } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

const rpcUrl = (import.meta.env.VITE_RPC_URL ?? '').trim() || undefined;

export const wagmiConfig = createConfig({
  chains: [base, polygon, arbitrum],
  connectors: [
    coinbaseWallet({
      appName: 'NΞØ Smart Factory',
      preference: 'all',
      version: '4',
    }),
    injected({ shimDisconnect: true }),
  ],
  transports: {
    [base.id]:     http(rpcUrl),
    [polygon.id]:  http(),
    [arbitrum.id]: http(),
  },
  ssr: false,
});
