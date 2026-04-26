import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

/**
 * Hook to use connected wallet from Dynamic.xyz
 * 
 * @returns {Object} - { address, isConnected, provider, signer }
 */
export function useDynamicWallet() {
    const context = useDynamicContext();

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
