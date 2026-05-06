import { useAccount, useConnect, useDisconnect, useChainId, usePublicClient } from 'wagmi';

export function useWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const publicClient = usePublicClient();

  return {
    address: address ?? null,
    isConnected,
    isPending,
    chainId,
    provider: publicClient ?? null,
    connect,
    connectors,
    disconnect,
  };
}
