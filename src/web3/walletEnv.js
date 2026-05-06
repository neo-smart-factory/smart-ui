/**
 * Detecção de ambiente de wallet — pura, sem React.
 * Portado de neoflw-token-page/src/web3/walletEnv.ts
 */

const MOBILE_UA_RE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i;

export function isMobile() {
  if (typeof window === 'undefined') return false;
  if (MOBILE_UA_RE.test(navigator.userAgent || '')) return true;
  return window.matchMedia?.('(pointer: coarse) and (max-width: 900px)').matches ?? false;
}

// ─── Provider injection (window.ethereum) ─────────────────────

function classifyProvider(p) {
  if (p.isBraveWallet)                          return { id: 'brave',             name: 'Brave Wallet' };
  if (p.isRabby)                                return { id: 'rabby',             name: 'Rabby' };
  if (p.isPhantom)                              return { id: 'phantom',           name: 'Phantom' };
  if (p.isFrame)                                return { id: 'frame',             name: 'Frame' };
  if (p.isTrust || p.isTrustWallet)            return { id: 'trust',             name: 'Trust Wallet' };
  if (p.isOkxWallet)                            return { id: 'okx',               name: 'OKX Wallet' };
  if (p.isZerion)                               return { id: 'zerion',            name: 'Zerion' };
  if (p.isRainbow)                              return { id: 'rainbow',           name: 'Rainbow' };
  if (p.isCoinbaseWallet || p.isCoinbaseBrowser) return { id: 'coinbase-extension', name: 'Coinbase Extension' };
  if (p.isMetaMask)                             return { id: 'metamask',          name: 'MetaMask' };
  return { id: 'injected', name: 'Browser Wallet' };
}

export function detectInjectedFlavor() {
  if (typeof window === 'undefined') return null;
  const eth = window.ethereum;
  if (!eth) return null;
  if (Array.isArray(eth.providers) && eth.providers.length > 0) {
    const specific = eth.providers.find((p) => {
      const f = classifyProvider(p);
      return f.id !== 'metamask' && f.id !== 'injected';
    });
    return classifyProvider(specific ?? eth.providers[0]);
  }
  return classifyProvider(eth);
}

// ─── Wagmi connector taxonomy ─────────────────────────────────

export function classifyConnector(c) {
  const id = c.id ?? '';
  const type = c.type ?? '';
  if (id === 'coinbaseWalletSDK' || id === 'coinbaseWallet' || type === 'coinbaseWallet')
    return 'coinbase-smart-wallet';
  if (type === 'walletConnect' || id === 'walletConnect') return 'walletconnect';
  if (/^[a-z0-9-]+\.[a-z0-9.-]+$/i.test(id)) return 'eip6963';
  if (id === 'injected' || type === 'injected') return 'injected-generic';
  return 'unknown';
}

/**
 * Auto-pick: EIP-6963 → injected-generic → Coinbase Smart Wallet
 * Sem dropdown — a wallet certa é escolhida automaticamente.
 */
export function pickConnector(connectors, hasInjectedProvider) {
  const eip6963 = connectors.find((c) => classifyConnector(c) === 'eip6963');
  if (eip6963) return eip6963;
  if (hasInjectedProvider) {
    const injectedGeneric = connectors.find((c) => classifyConnector(c) === 'injected-generic');
    if (injectedGeneric) return injectedGeneric;
  }
  return connectors.find((c) => classifyConnector(c) === 'coinbase-smart-wallet') ?? null;
}

// ─── Mobile deep links ────────────────────────────────────────

function currentUrl() {
  return typeof window !== 'undefined' ? window.location.href : '';
}

function safeDappPath(url) {
  return url.replace(/^https?:\/\//, '').replace(/[\s"'<>\\^`{|}]+/g, '');
}

export const mobileDeeplinks = {
  coinbase: (url = currentUrl()) => `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(url)}`,
  metamask: (url = currentUrl()) => `https://metamask.app.link/dapp/${safeDappPath(url)}`,
};
