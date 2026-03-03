//github.com/neo-smart-factory/smart-ui/issues/17import ReactDOM from 'react-dom/client';
ehttps: import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { base, mainnet, polygon } from "viem/chains";

import App from "./App";
import "./index.css";

const dynamicEnvId = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID;

const config = createConfig({
  chains: [mainnet, polygon, base],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <DynamicContextProvider
    settings={{
      environmentId: dynamicEnvId,
      walletConnectors: [
        EthereumWalletConnectors,
        ZeroDevSmartWalletConnectors,
      ],
    }}
  >
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <DynamicWagmiConnector>
          <App />
        </DynamicWagmiConnector>
      </QueryClientProvider>
    </WagmiProvider>
  </DynamicContextProvider>,
);
