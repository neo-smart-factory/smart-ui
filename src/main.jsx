
import ReactDOM from 'react-dom/client';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import App from './App';
import './index.css';

const dynamicEnvId = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID || '2762a57b-faa4-41ce-9f16-abff9300e2c9'; // Default for dev/demo

ReactDOM.createRoot(document.getElementById('root')).render(
    <DynamicContextProvider
        settings={{
            environmentId: dynamicEnvId,
            walletConnectors: [EthereumWalletConnectors],
        }}
    >
        <App />
    </DynamicContextProvider>
);
