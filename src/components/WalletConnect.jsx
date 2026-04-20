/**
 * NΞØ Smart Factory — WalletConnect Component
 * 
 * Componente para conexão de wallet usando Dynamic.xyz
 * 
 * @see https://docs.dynamic.xyz/
 */

import { useEffect, useRef } from 'react';
import { ChevronDown, Wallet } from 'lucide-react';
import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import useFeatures from '../hooks/useFeatures';
import ErrorBoundary from './ErrorBoundary';
import WalletErrorFallback from './WalletErrorFallback';
import LoadingSpinner from './ui/LoadingSpinner';
import { validateAddress, formatAddress } from '../utils/addressValidation';

const EXPECTED_CHAIN_ID = 8453; // Base mainnet

const NETWORK_META = {
  1: { label: 'Ethereum', shortLabel: 'ETH', badgeClass: 'bg-slate-700/60 text-slate-100 border-slate-500/40' },
  137: { label: 'Polygon', shortLabel: 'POL', badgeClass: 'bg-violet-600/20 text-violet-200 border-violet-400/40' },
  8453: { label: 'Base', shortLabel: 'BASE', badgeClass: 'bg-blue-600/20 text-blue-200 border-blue-400/40' },
};

function parseChainId(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    if (value.startsWith('0x')) {
      const parsedHex = Number.parseInt(value, 16);
      return Number.isFinite(parsedHex) ? parsedHex : null;
    }

    const parsedInt = Number.parseInt(value, 10);
    return Number.isFinite(parsedInt) ? parsedInt : null;
  }

  return null;
}

function getNetworkInfo(chainId) {
  if (!chainId) return null;
  const known = NETWORK_META[chainId];

  if (known) {
    return {
      ...known,
      chainId,
    };
  }

  return {
    label: `Chain ${chainId}`,
    shortLabel: `#${chainId}`,
    badgeClass: 'bg-white/10 text-slate-300 border-white/15',
    chainId,
  };
}

/**
 * Internal component that has access to Dynamic context
 */
function WalletConnectInner({ onConnect, onDisconnect, userAddress, setUserAddress, className }) {
  const { primaryWallet, isAuthenticated, sdkHasLoaded } = useDynamicContext();
  const prevAddressRef = useRef(null);
  const publicClient = primaryWallet?.connector?.getPublicClient?.();
  const walletChainId =
    parseChainId(publicClient?.chain?.id) ||
    parseChainId(publicClient?.chainId) ||
    parseChainId(primaryWallet?.chainId);
  const networkInfo = getNetworkInfo(walletChainId);
  const isWrongNetwork = Boolean(userAddress && walletChainId && walletChainId !== EXPECTED_CHAIN_ID);

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
    <div className="flex items-center gap-2">
      <DynamicWidget
        variant="modal"
        buttonClassName={`wallet-btn ${className} ${isWrongNetwork ? 'is-wrong-network' : ''}`.trim()}
        innerButtonComponent={
          <>
            {!sdkHasLoaded ? (
              <>
                <LoadingSpinner size="sm" className="!w-3.5 !h-3.5" />
                <span className="text-xs font-medium">Loading...</span>
              </>
            ) : !isAuthenticated && primaryWallet ? (
              <>
                <LoadingSpinner size="sm" className="!w-3.5 !h-3.5" />
                <span className="text-xs font-medium">Authenticating...</span>
              </>
            ) : (
              <>
                {userAddress ? (
                  <>
                    <span className="wallet-status-dot" />
                    {networkInfo && (
                      <span
                        className={`wallet-network-badge ${networkInfo.badgeClass}`}
                        title={`Connected on ${networkInfo.label} (${networkInfo.chainId})`}
                      >
                        {networkInfo.shortLabel}
                      </span>
                    )}
                    <Wallet className="w-3.5 h-3.5 opacity-80" />
                    <span className="font-mono text-xs">
                      {isWrongNetwork ? 'Wrong Network' : formatAddress(userAddress)}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </>
                ) : (
                  <>
                    <Wallet className="w-3.5 h-3.5" />
                    <span className="text-[13px] font-semibold leading-none">Connect Wallet</span>
                  </>
                )}
              </>
            )}
          </>
        }
      />
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
      <div className="flex items-center gap-2">
        <button
          disabled
          className={`btn-secondary !py-2 !px-4 !text-xs flex items-center gap-2 opacity-50 cursor-not-allowed ${className}`.trim()}
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


