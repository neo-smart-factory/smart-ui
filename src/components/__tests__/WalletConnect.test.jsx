import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('wagmi', () => ({
  useAccount:    vi.fn(),
  useConnect:    vi.fn(),
  useDisconnect: vi.fn(),
  useChainId:    vi.fn(),
}));

vi.mock('../../hooks/useFeatures', () => ({ default: vi.fn() }));
vi.mock('../../web3/walletEnv', () => ({
  pickConnector:         vi.fn(() => ({ id: 'injected' })),
  detectInjectedFlavor:  vi.fn(() => null),
  isMobile:              vi.fn(() => false),
  mobileDeeplinks:       { coinbase: vi.fn() },
}));

import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import useFeatures from '../../hooks/useFeatures';
import WalletConnect from '../WalletConnect';

const mockConnect    = vi.fn();
const mockDisconnect = vi.fn();

function setupWagmi({ address = null, isConnected = false, chainId = 8453 } = {}) {
  useAccount.mockReturnValue({ address, isConnected });
  useConnect.mockReturnValue({ connectors: [], connect: mockConnect, isPending: false });
  useDisconnect.mockReturnValue({ disconnect: mockDisconnect });
  useChainId.mockReturnValue(chainId);
}

describe('WalletConnect', () => {
  it('shows simulation fallback when web3 is disabled', () => {
    useFeatures.mockReturnValue({ isEnabled: () => false });
    setupWagmi();
    render(<WalletConnect />);
    expect(screen.getByRole('button', { name: /Web3 \(Phase 2\)/i })).toBeDisabled();
  });

  it('shows Connect Wallet button when not connected', () => {
    useFeatures.mockReturnValue({ isEnabled: () => true });
    setupWagmi({ isConnected: false });
    render(<WalletConnect />);
    expect(screen.getByRole('button', { name: /Connect Wallet/i })).toBeInTheDocument();
  });

  it('normalizes address and fires onConnect (issue #17)', async () => {
    const onConnect    = vi.fn();
    const setUserAddress = vi.fn();
    const lowerAddress   = '0x742d35cc6634c0532925a3b844bc454e4438f44e';

    useFeatures.mockReturnValue({ isEnabled: () => true });
    setupWagmi({ address: lowerAddress, isConnected: true });

    render(<WalletConnect userAddress={null} setUserAddress={setUserAddress} onConnect={onConnect} />);

    await waitFor(() => {
      expect(setUserAddress).toHaveBeenCalledWith(expect.stringMatching(/^0x742d35Cc/i));
      expect(onConnect).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onDisconnect when wallet disconnects', async () => {
    const onConnect    = vi.fn();
    const onDisconnect = vi.fn();
    const addr         = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

    useFeatures.mockReturnValue({ isEnabled: () => true });
    setupWagmi({ address: addr, isConnected: true });

    const { rerender } = render(<WalletConnect onConnect={onConnect} onDisconnect={onDisconnect} />);

    await waitFor(() => expect(onConnect).toHaveBeenCalledTimes(1));

    useAccount.mockReturnValue({ address: undefined, isConnected: false });
    rerender(<WalletConnect onConnect={onConnect} onDisconnect={onDisconnect} />);

    await waitFor(() => expect(onDisconnect).toHaveBeenCalledTimes(1));
  });

  describe('network badge', () => {
    const addr = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

    it('shows BASE badge for chainId 8453', async () => {
      useFeatures.mockReturnValue({ isEnabled: () => true });
      setupWagmi({ address: addr, isConnected: true, chainId: 8453 });
      render(<WalletConnect userAddress={addr} />);
      expect(await screen.findByTitle('Base (8453)')).toHaveTextContent('BASE');
    });

    it('shows POL badge for chainId 137', async () => {
      useFeatures.mockReturnValue({ isEnabled: () => true });
      setupWagmi({ address: addr, isConnected: true, chainId: 137 });
      render(<WalletConnect userAddress={addr} />);
      expect(await screen.findByTitle('Polygon (137)')).toHaveTextContent('POL');
    });

    it('shows ARB badge for chainId 42161', async () => {
      useFeatures.mockReturnValue({ isEnabled: () => true });
      setupWagmi({ address: addr, isConnected: true, chainId: 42161 });
      render(<WalletConnect userAddress={addr} />);
      expect(await screen.findByTitle('Arbitrum (42161)')).toHaveTextContent('ARB');
    });

    it('shows generic badge for unknown chain', async () => {
      useFeatures.mockReturnValue({ isEnabled: () => true });
      setupWagmi({ address: addr, isConnected: true, chainId: 999999 });
      render(<WalletConnect userAddress={addr} />);
      expect(await screen.findByTitle('Chain 999999 (999999)')).toHaveTextContent('#999999');
    });

    it('shows Wrong Network when chain differs from selectedNetwork', async () => {
      useFeatures.mockReturnValue({ isEnabled: () => true });
      setupWagmi({ address: addr, isConnected: true, chainId: 137 });
      render(<WalletConnect userAddress={addr} selectedNetwork="base" />);
      expect(await screen.findByText('Wrong Network')).toBeInTheDocument();
    });

    it('no Wrong Network when chain matches selectedNetwork', async () => {
      useFeatures.mockReturnValue({ isEnabled: () => true });
      setupWagmi({ address: addr, isConnected: true, chainId: 137 });
      render(<WalletConnect userAddress={addr} selectedNetwork="polygon" />);
      expect(await screen.findByTitle('Polygon (137)')).toBeInTheDocument();
      expect(screen.queryByText('Wrong Network')).not.toBeInTheDocument();
    });
  });
});
