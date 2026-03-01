import { isAddress, getAddress } from "ethers";

/**
 * Validates an Ethereum address using ethers.js
 * Supports format check and EIP-55 checksum validation
 *
 * @param {string} address - The address to validate
 * @returns {Object} - { valid: boolean, error: string|null, normalized: string|null }
 */
export function validateAddress(address) {
  if (!address) {
    return { valid: false, error: "Address is required", normalized: null };
  }

  // Basic hex check first for better error messages
  if (!address.startsWith("0x")) {
    return {
      valid: false,
      error: "Address must start with 0x",
      normalized: null,
    };
  }

  if (address.length !== 42) {
    return {
      valid: false,
      error: "Address must be exactly 42 characters",
      normalized: null,
    };
  }

  try {
    if (!isAddress(address)) {
      return {
        valid: false,
        error: "Invalid address format or checksum",
        normalized: null,
      };
    }

    // Normalize to checksum format
    const normalized = getAddress(address);
    return { valid: true, error: null, normalized };
  } catch {
    return { valid: false, error: "Invalid address", normalized: null };
  }
}

/**
 * Formats an address for display (short version)
 *
 * @param {string} address - The address to format
 * @param {number} start - Number of characters to show at the start
 * @param {number} end - Number of characters to show at the end
 * @returns {string} - Formatted address (e.g., 0x1234...5678)
 */
export function formatAddress(address, start = 6, end = 4) {
  if (!address) return "";

  // SEGURANÇA: Validação antes de processar
  try {
    if (!isAddress(address)) return address;
    // Use checksummed version for formatting
    const checksummed = getAddress(address);
    return `${checksummed.slice(0, start)}...${checksummed.slice(-end)}`;
  } catch (error) {
    console.warn("[addressValidation] formatAddress error:", error);
    return address.length > 10
      ? `${address.slice(0, start)}...${address.slice(-end)}`
      : address;
  }
}

/**
 * Compares two addresses for equality (case-insensitive)
 *
 * @param {string} addr1
 * @param {string} addr2
 * @returns {boolean}
 */
export function isSameAddress(addr1, addr2) {
  if (!addr1 || !addr2) return false;
  try {
    return getAddress(addr1) === getAddress(addr2);
  } catch {
    return addr1.toLowerCase() === addr2.toLowerCase();
  }
}

/**
 * Formats a transaction hash for display
 *
 * @param {string} hash
 * @param {number} start
 * @param {number} end
 * @returns {string}
 */
export function formatHash(hash, start = 10, end = 8) {
  if (!hash) return "";
  if (hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}
