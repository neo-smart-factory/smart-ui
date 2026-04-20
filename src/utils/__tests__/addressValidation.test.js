import { getAddress } from "ethers";
import { describe, expect, it } from "vitest";
import {
  formatAddress,
  formatHash,
  isSameAddress,
  validateAddress,
} from "../addressValidation";

describe("addressValidation", () => {
  const lowerAddress = "0x742d35cc6634c0532925a3b844bc454e4438f44e";
  const checksummedAddress = getAddress(lowerAddress);

  it("validates empty address", () => {
    expect(validateAddress("")).toEqual({
      valid: false,
      error: "Address is required",
      normalized: null,
    });
  });

  it("validates missing 0x prefix", () => {
    expect(validateAddress("742d35cc6634c0532925a3b844bc454e4438f44e")).toEqual(
      {
        valid: false,
        error: "Address must start with 0x",
        normalized: null,
      },
    );
  });

  it("validates address length", () => {
    expect(validateAddress("0x1234")).toEqual({
      valid: false,
      error: "Address must be exactly 42 characters",
      normalized: null,
    });
  });

  it("normalizes valid address to checksum format", () => {
    expect(validateAddress(lowerAddress)).toEqual({
      valid: true,
      error: null,
      normalized: checksummedAddress,
    });
  });

  it("formats valid addresses with ellipsis", () => {
    expect(formatAddress(lowerAddress)).toBe(
      `${checksummedAddress.slice(0, 6)}...${checksummedAddress.slice(-4)}`,
    );
  });

  it("returns raw value when formatting invalid addresses", () => {
    expect(formatAddress("invalid-address")).toBe("invalid-address");
  });

  it("keeps invalid short address unchanged during format", () => {
    const strangeInput = "0x123";
    expect(formatAddress(strangeInput, 3, 2)).toBe(strangeInput);
  });

  it("compares addresses ignoring case", () => {
    expect(isSameAddress(lowerAddress, checksummedAddress)).toBe(true);
  });

  it("returns false when any address is missing", () => {
    expect(isSameAddress(null, checksummedAddress)).toBe(false);
  });

  it("formats transaction hash safely", () => {
    const hash =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    expect(formatHash(hash, 8, 6)).toBe("0x123456...abcdef");
  });
});
