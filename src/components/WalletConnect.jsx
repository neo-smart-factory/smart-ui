import { useEffect, useRef, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { ChevronDown, Wallet } from 'lucide-react';
import useFeatures from '../hooks/useFeatures';
import ErrorBoundary from './ErrorBoundary';
import WalletErrorFallback from './WalletErrorFallback';
import { validateAddress, formatAddress } from '../utils/addressValidation';
import { pickConnector, detectInjectedFlavor, isMobile, mobileDeeplinks } from '../web3/walletEnv';

const NETWORK_CHAIN_IDS = {
  base: 8453,
  polygon: 137,
  arbitrum: 42161,
};

const NETWORK_META = {
  1:     { label: 'Ethereum', shortLabel: 'ETH', badgeClass: 'bg-slate-700/60 text-slate-100 border-slate-500/40' },
  137:   { label: 'Polygon',  shortLabel: 'POL', badgeClass: 'bg-violet-600/20 text-violet-200 border-violet-400/40' },
  8453:  { label: 'Base',     shortLabel: 'BASE', badgeClass: 'bg-blue-600/20 text-blue-200 border-blue-400/40' },
  42161: { label: 'Arbitrum', shortLabel: 'ARB', badgeClass: 'bg-sky-600/20 text-sky-200 border-sky-400/40' },
};

function getNetworkInfo(chainId) {
  if (!chainId) return null;
  const known = NETWORK_META[chainId];
  if (known) return { ...known, chainId };
  return { label: `Chain ${chainId}`, shortLabel: `#${chainId}`, badgeClass: 'bg-white/10 text-slate-300 border-white/15', chainId };
}

function WalletConnectInner({ onConnect, onDisconnect, userAddress, setUserAddress, className, selectedNetwork = 'base' }) {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const walletChainId = useChainId();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const prevAddressRef = useRef(null);

  const expectedChainId = NETWORK_CHAIN_IDS[selectedNetwork] ?? null;
  const validation = validateAddress(address ?? null);
  const displayAddress = userAddress || (validation.valid ? validation.normalized : null);
  const networkInfo = getNetworkInfo(walletChainId);
  const isWrongNetwork = Boolean(isConnected && walletChainId && expectedChainId && walletChainId !== expectedChainId);

  // Close menu on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  // Sync address to parent + fire callbacks
  useEffect(() => {
    const effectiveAddress = validation.valid ? validation.normalized : null;
    const prev = prevAddressRef.current;

    if (setUserAddress && effectiveAddress !== userAddress) setUserAddress(effectiveAddress);
    if (isConnected && effectiveAddress && !prev && onConnect) onConnect(effectiveAddress);
    if (!isConnected && prev && onDisconnect) onDisconnect();

    prevAddressRef.current = address ?? null;
  }, [address, isConnected, onConnect, onDisconnect, setUserAddress, userAddress, validation]);

  function handleConnect() {
    const picked = pickConnector(connectors, detectInjectedFlavor() !== null);
    if (picked) { connect({ connector: picked }); return; }
    if (isMobile()) window.open(mobileDeeplinks.coinbase(), '_blank', 'noopener,noreferrer');
  }

  if (isConnected && displayAddress) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          className={`wallet-btn ${className} ${isWrongNetwork ? 'is-wrong-network' : ''}`.trim()}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
        >
          <span className="wallet-status-dot" />
          {networkInfo && (
            <span className={`wallet-network-badge ${networkInfo.badgeClass}`} title={`${networkInfo.label} (${networkInfo.chainId})`}>
              {networkInfo.shortLabel}
            </span>
          )}
          <Wallet className="w-3.5 h-3.5 opacity-80" />
          <span className="font-mono text-xs">
            {isWrongNetwork ? 'Wrong Network' : formatAddress(displayAddress)}
          </span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-1 w-48 rounded-lg border border-white/10 bg-zinc-900 shadow-xl z-50" role="menu">
            <div className="px-3 py-2 text-xs text-zinc-400 border-b border-white/10 font-mono">
              {formatAddress(displayAddress)}
            </div>
            <button
              type="button"
              role="menuitem"
              className="w-full px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5 transition-colors"
              onClick={() => { navigator.clipboard?.writeText(address ?? ''); setMenuOpen(false); }}
            >
              Copy address
            </button>
            <a
              role="menuitem"
              className="block px-3 py-2 text-sm text-zinc-200 hover:bg-white/5 transition-colors"
              href={`https://basescan.org/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Basescan ↗
            </a>
            <button
              type="button"
              role="menuitem"
              className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5 transition-colors border-t border-white/10"
              onClick={() => { disconnect(); setMenuOpen(false); }}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`wallet-btn ${className}`.trim()}
      onClick={handleConnect}
      disabled={isPending}
    >
      <Wallet className="w-3.5 h-3.5" />
      <span className="text-[13px] font-semibold leading-none">
        {isPending ? 'Connecting…' : 'Connect Wallet'}
      </span>
    </button>
  );
}

export default function WalletConnect({
  className = '',
  onConnect = null,
  onDisconnect = null,
  userAddress = null,
  setUserAddress = null,
  selectedNetwork = 'base',
}) {
  const { isEnabled } = useFeatures();

  if (!isEnabled('phase2', 'web3')) {
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
        <WalletErrorFallback error={error} onRetry={reset} onUseSimulation={() => {}} />
      )}
      onError={(error, errorInfo) => console.error('[WalletConnect] Error:', error, errorInfo)}
    >
      <WalletConnectInner
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        userAddress={userAddress}
        setUserAddress={setUserAddress}
        className={className}
        selectedNetwork={selectedNetwork}
      />
    </ErrorBoundary>
  );
}
