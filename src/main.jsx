
import ReactDOM from 'react-dom/client';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import App from './App';
import './index.css';

const dynamicEnvId = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID

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
