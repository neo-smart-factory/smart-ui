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
});
