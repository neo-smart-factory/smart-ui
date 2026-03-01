import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

/**
 * Hook to use connected wallet from Dynamic.xyz
 *
 * NOTE: This hook uses a try-catch pattern which technically violates React's
 * rules of hooks. This is a pragmatic solution for Phase 01 where Web3 is disabled.
 *
 * TODO Phase 02: Refactor to one of these patterns:
 * 1. Wrap entire App in DynamicContextProvider (recommended)
 * 2. Create a higher-order component
 * 3. Use React Context for optional provider pattern
 *
 * @returns {Object} - { address, isConnected, provider, signer }
 */
export function useDynamicWallet() {
  // Try to get the context, but handle the case where we're not inside a provider
  let context = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    context = useDynamicContext();
  } catch {
    // Expected when called outside DynamicContextProvider (Phase 01 - Web3 disabled)
    // Return safe defaults
    return {
      address: null,
      isConnected: false,
      provider: null,
      signer: null,
    };
  }

  // If context is null or undefined, return defaults
  if (!context) {
    return {
      address: null,
      isConnected: false,
      provider: null,
      signer: null,
    };
  }

  const { primaryWallet, isAuthenticated } = context;

  return {
    address: primaryWallet?.address || null,
    isConnected: isAuthenticated && !!primaryWallet,
    provider: primaryWallet?.connector?.getPublicClient?.() || null,
    signer: primaryWallet?.connector?.getSigner?.() || null,
  };
}
