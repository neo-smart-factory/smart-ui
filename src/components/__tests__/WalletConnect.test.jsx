import { getAddress } from "ethers";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@dynamic-labs/sdk-react-core", () => ({
  DynamicWidget: ({ innerButtonComponent }) => (
    <div data-testid="dynamic-widget">{innerButtonComponent}</div>
  ),
  useDynamicContext: vi.fn(),
}));

vi.mock("../../hooks/useFeatures", () => ({
  default: vi.fn(),
}));

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import useFeatures from "../../hooks/useFeatures";
import WalletConnect from "../WalletConnect";

const mockedUseDynamicContext = vi.mocked(useDynamicContext);
const mockedUseFeatures = vi.mocked(useFeatures);

describe("WalletConnect", () => {
  it("shows simulation fallback button when web3 is disabled", () => {
    mockedUseFeatures.mockReturnValue({
      isEnabled: () => false,
    });

    render(<WalletConnect />);

    const button = screen.getByRole("button", { name: /Web3 \(Phase 2\)/i });
    expect(button).toBeDisabled();
  });

  it("connects valid wallet and normalizes address (issue #17)", async () => {
    const onConnect = vi.fn();
    const setUserAddress = vi.fn();
    const lowerAddress = "0x742d35cc6634c0532925a3b844bc454e4438f44e";

    mockedUseFeatures.mockReturnValue({
      isEnabled: () => true,
    });

    mockedUseDynamicContext.mockReturnValue({
      sdkHasLoaded: true,
      isAuthenticated: true,
      primaryWallet: { address: lowerAddress },
    });

    render(
      <WalletConnect
        userAddress={null}
        setUserAddress={setUserAddress}
        onConnect={onConnect}
      />,
    );

    const expected = getAddress(lowerAddress);

    await waitFor(() => {
      expect(setUserAddress).toHaveBeenCalledWith(expected);
      expect(onConnect).toHaveBeenCalledWith(expected);
    });

    expect(screen.getByTestId("dynamic-widget")).toBeInTheDocument();
  });

  it("calls onDisconnect when wallet gets disconnected", async () => {
    const onConnect = vi.fn();
    const onDisconnect = vi.fn();

    mockedUseFeatures.mockReturnValue({
      isEnabled: () => true,
    });

    let currentContext = {
      sdkHasLoaded: true,
      isAuthenticated: true,
      primaryWallet: { address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
    };

    mockedUseDynamicContext.mockImplementation(() => currentContext);

    const { rerender } = render(
      <WalletConnect onConnect={onConnect} onDisconnect={onDisconnect} />,
    );

    await waitFor(() => {
      expect(onConnect).toHaveBeenCalledTimes(1);
    });

    currentContext = {
      sdkHasLoaded: true,
      isAuthenticated: false,
      primaryWallet: null,
    };

    rerender(
      <WalletConnect onConnect={onConnect} onDisconnect={onDisconnect} />,
    );

    await waitFor(() => {
      expect(onDisconnect).toHaveBeenCalledTimes(1);
    });
  });

  describe("network badge rendering", () => {
    const userAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

    it("shows BASE badge for Base mainnet (numeric chainId 8453) from primaryWallet.chainId", async () => {
      mockedUseFeatures.mockReturnValue({ isEnabled: () => true });
      mockedUseDynamicContext.mockReturnValue({
        sdkHasLoaded: true,
        isAuthenticated: true,
        primaryWallet: { address: userAddress, chainId: 8453 },
      });

      render(<WalletConnect userAddress={userAddress} />);

      const badge = await screen.findByTitle("Connected on Base (8453)");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("BASE");
    });

    it("shows POL badge for Polygon (chainId 137) from publicClient.chain.id", async () => {
      mockedUseFeatures.mockReturnValue({ isEnabled: () => true });
      mockedUseDynamicContext.mockReturnValue({
        sdkHasLoaded: true,
        isAuthenticated: true,
        primaryWallet: {
          address: userAddress,
          connector: {
            getPublicClient: () => ({ chain: { id: 137 } }),
          },
        },
      });

      render(<WalletConnect userAddress={userAddress} />);

      const badge = await screen.findByTitle("Connected on Polygon (137)");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("POL");
    });

    it("shows BASE badge when chainId is provided as hex string (0x2105 = 8453)", async () => {
      mockedUseFeatures.mockReturnValue({ isEnabled: () => true });
      mockedUseDynamicContext.mockReturnValue({
        sdkHasLoaded: true,
        isAuthenticated: true,
        primaryWallet: { address: userAddress, chainId: "0x2105" },
      });

      render(<WalletConnect userAddress={userAddress} />);

      const badge = await screen.findByTitle("Connected on Base (8453)");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("BASE");
    });

    it("shows generic badge with shortLabel for unknown chain", async () => {
      mockedUseFeatures.mockReturnValue({ isEnabled: () => true });
      mockedUseDynamicContext.mockReturnValue({
        sdkHasLoaded: true,
        isAuthenticated: true,
        primaryWallet: { address: userAddress, chainId: 999999 },
      });

      render(<WalletConnect userAddress={userAddress} />);

      const badge = await screen.findByTitle("Connected on Chain 999999 (999999)");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("#999999");
    });

    it("shows no network badge when chainId is unavailable", async () => {
      mockedUseFeatures.mockReturnValue({ isEnabled: () => true });
      mockedUseDynamicContext.mockReturnValue({
        sdkHasLoaded: true,
        isAuthenticated: true,
        primaryWallet: { address: userAddress },
      });

      render(<WalletConnect userAddress={userAddress} />);

      await screen.findByText(/0x742d/i);
      expect(screen.queryByTitle(/Connected on/i)).not.toBeInTheDocument();
    });

    it("shows Wrong Network text when connected to a chain other than EXPECTED_CHAIN_ID", async () => {
      mockedUseFeatures.mockReturnValue({ isEnabled: () => true });
      mockedUseDynamicContext.mockReturnValue({
        sdkHasLoaded: true,
        isAuthenticated: true,
        primaryWallet: { address: userAddress, chainId: 137 },
      });

      render(<WalletConnect userAddress={userAddress} />);

      expect(await screen.findByText("Wrong Network")).toBeInTheDocument();
    });
  });

  it("does not show wrong network when selected network matches chain", async () => {
    mockedUseFeatures.mockReturnValue({
      isEnabled: () => true,
    });

    mockedUseDynamicContext.mockReturnValue({
      sdkHasLoaded: true,
      isAuthenticated: true,
      primaryWallet: {
        address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        connector: {
          getPublicClient: () => ({ chain: { id: 137 } }),
        },
      },
    });

    render(
      <WalletConnect
        userAddress="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
        selectedNetwork="polygon"
      />,
    );

    const badge = await screen.findByText("POL");
    expect(badge).toBeInTheDocument();
    expect(screen.queryByText("Wrong Network")).not.toBeInTheDocument();
  });

  it("shows wrong network even when userAddress prop is null if wallet is authenticated", async () => {
    mockedUseFeatures.mockReturnValue({
      isEnabled: () => true,
    });

    mockedUseDynamicContext.mockReturnValue({
      sdkHasLoaded: true,
      isAuthenticated: true,
      primaryWallet: {
        address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        connector: {
          getPublicClient: () => ({ chain: { id: 137 } }),
        },
      },
    });

    render(<WalletConnect userAddress={null} selectedNetwork="base" />);

    const badge = await screen.findByText("POL");
    expect(badge).toBeInTheDocument();
    expect(screen.getByText("Wrong Network")).toBeInTheDocument();
  });
});
