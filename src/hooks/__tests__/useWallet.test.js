import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('wagmi', () => ({
  useAccount:      vi.fn(),
  useConnect:      vi.fn(),
  useDisconnect:   vi.fn(),
  useChainId:      vi.fn(),
  usePublicClient: vi.fn(),
}));

import { useAccount, useConnect, useDisconnect, useChainId, usePublicClient } from 'wagmi';
import { useWallet } from '../useWallet';

describe('useWallet', () => {
  it('returns disconnected defaults when not connected', () => {
    useAccount.mockReturnValue({ address: undefined, isConnected: false });
    useConnect.mockReturnValue({ connect: vi.fn(), connectors: [], isPending: false });
    useDisconnect.mockReturnValue({ disconnect: vi.fn() });
    useChainId.mockReturnValue(8453);
    usePublicClient.mockReturnValue(null);

    const { result } = renderHook(() => useWallet());

    expect(result.current.address).toBeNull();
    expect(result.current.isConnected).toBe(false);
    expect(result.current.chainId).toBe(8453);
  });

  it('returns wallet info when connected', () => {
    const publicClient = { getBalance: vi.fn() };
    const addr = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

    useAccount.mockReturnValue({ address: addr, isConnected: true });
    useConnect.mockReturnValue({ connect: vi.fn(), connectors: [], isPending: false });
    useDisconnect.mockReturnValue({ disconnect: vi.fn() });
    useChainId.mockReturnValue(8453);
    usePublicClient.mockReturnValue(publicClient);

    const { result } = renderHook(() => useWallet());

    expect(result.current.address).toBe(addr);
    expect(result.current.isConnected).toBe(true);
    expect(result.current.provider).toBe(publicClient);
    expect(result.current.chainId).toBe(8453);
  });
});
