import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@dynamic-labs/sdk-react-core', () => ({
  useDynamicContext: vi.fn(),
}));

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useDynamicWallet } from '../useDynamicWallet';

const mockedUseDynamicContext = vi.mocked(useDynamicContext);

describe('useDynamicWallet', () => {
  it('returns safe defaults when used outside provider', () => {
    mockedUseDynamicContext.mockImplementation(() => {
      throw new Error('outside provider');
    });

    const { result } = renderHook(() => useDynamicWallet());

    expect(result.current).toEqual({
      address: null,
      isConnected: false,
      provider: null,
      signer: null,
    });
  });

  it('returns safe defaults when context is null', () => {
    mockedUseDynamicContext.mockReturnValue(null);

    const { result } = renderHook(() => useDynamicWallet());

    expect(result.current.isConnected).toBe(false);
    expect(result.current.address).toBeNull();
  });

  it('returns connected wallet info when authenticated', () => {
    const provider = { chainId: 8453 };
    const signer = { signMessage: vi.fn() };

    mockedUseDynamicContext.mockReturnValue({
      isAuthenticated: true,
      primaryWallet: {
        address: '0x742d35Cc6634C0532925a3B844Bc454e4438f44e',
        connector: {
          getPublicClient: () => provider,
          getSigner: () => signer,
        },
      },
    });

    const { result } = renderHook(() => useDynamicWallet());

    expect(result.current.isConnected).toBe(true);
    expect(result.current.address).toBe('0x742d35Cc6634C0532925a3B844Bc454e4438f44e');
    expect(result.current.provider).toBe(provider);
    expect(result.current.signer).toBe(signer);
  });

  it('is not connected when not authenticated', () => {
    mockedUseDynamicContext.mockReturnValue({
      isAuthenticated: false,
      primaryWallet: {
        address: '0x742d35Cc6634C0532925a3B844Bc454e4438f44e',
      },
    });

    const { result } = renderHook(() => useDynamicWallet());

    expect(result.current.isConnected).toBe(false);
  });
});
