/**
 * NΞØ Smart Factory — WalletConnect Component
 * 
 * Componente para conexão de wallet usando Dynamic.xyz
 * 
 * @see https://docs.dynamic.xyz/
 */

import { useEffect, useRef } from 'react';
import { Wallet, Rocket, Zap } from 'lucide-react';
import { DynamicContextProvider, DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import useFeatures from '../hooks/useFeatures';
import ErrorBoundary from './ErrorBoundary';
import WalletErrorFallback from './WalletErrorFallback';
import LoadingSpinner from './ui/LoadingSpinner';
import { validateAddress, formatAddress } from '../utils/addressValidation';

/**
 * Internal component that has access to Dynamic context
 */
function WalletConnectInner({ onConnect, onDisconnect, userAddress, setUserAddress, className }) {
  const { primaryWallet, isAuthenticated, sdkHasLoaded } = useDynamicContext();
  const prevAddressRef = useRef(null);

  // Effect to handle wallet connection/disconnection callbacks
  useEffect(() => {
    const walletAddress = primaryWallet?.address || null;
    const isConnected = isAuthenticated && !!primaryWallet;
    const prevAddress = prevAddressRef.current;

    const validation = validateAddress(walletAddress);
    const effectiveAddress = validation.valid ? validation.normalized : null;

    // Update parent component state if provided
    if (setUserAddress && effectiveAddress !== userAddress) {
      setUserAddress(effectiveAddress);
    }

    // Handle connection callback (when address changes from null to a value)
    if (isConnected && effectiveAddress && !prevAddress) {
      if (onConnect) {
        onConnect(effectiveAddress);
      }
    }

    // Handle disconnection callback (when address changes from a value to null)
    if (!isConnected && prevAddress) {
      if (onDisconnect) {
        onDisconnect();
      }
    }

    // Update ref for next render
    prevAddressRef.current = walletAddress;
  }, [primaryWallet, isAuthenticated, onConnect, onDisconnect, setUserAddress, userAddress]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="glass-frame">
        <DynamicWidget
          variant="modal"
          buttonClassName={`${className} !py-2 !px-8 !text-xs flex items-center gap-2 group transition-all duration-500`}
          innerButtonComponent={
            <div className="flex items-center gap-2 min-w-[100px] justify-center tracking-[0.1em]">
              {!sdkHasLoaded ? (
                <>
                  <LoadingSpinner size="sm" className="!w-3 !h-3" />
                  <span>INITIALIZING...</span>
                </>
              ) : !isAuthenticated && primaryWallet ? (
                <>
                  <LoadingSpinner size="sm" className="!w-3 !h-3" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  {userAddress ? (
                    <>
                      <Wallet className="w-3.5 h-3.5 opacity-80" />
                      <span className="font-mono">{formatAddress(userAddress)}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
                      <span className="font-headline font-black text-xs tracking-[0.2em]">MINT TOKEN</span>
                    </>
                  )}
                </>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}

export default function WalletConnect({
  className = '',
  onConnect = null,
  onDisconnect = null,
  userAddress = null,
  setUserAddress = null,
}) {
  const { isEnabled } = useFeatures();
  const isWeb3Enabled = isEnabled('phase2', 'web3');

  // Se Web3 não está habilitado, mostrar modo simulação
  if (!isWeb3Enabled) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          disabled
          className="btn-secondary !py-2 !px-4 !text-xs flex items-center gap-2 opacity-50 cursor-not-allowed"
          title="Web3 features will be available in Phase 2"
        >
          <Wallet className="w-3 h-3" />
          <span>Web3 (Phase 2)</span>
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary
      componentName="WalletConnect"
      level="critical"
      fallback={(error, reset) => (
        <WalletErrorFallback
          error={error}
          onRetry={reset}
          onUseSimulation={() => {
            // Fallback para simulation mode se disponível
            console.info('[WalletConnect] Using simulation mode fallback');
          }}
        />
      )}
      onError={(error, errorInfo) => {
        console.error('[WalletConnect] Error caught by boundary:', error, errorInfo);
      }}
    >
      <WalletConnectInner
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        userAddress={userAddress}
        setUserAddress={setUserAddress}
        className={className}
      />
    </ErrorBoundary>
  );
}


