// Script para testar a validação de endereços
import { validateAddress } from "../src/utils/addressValidation.js";

const testAddresses = [
  {
    addr: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    desc: "Valid Checksummed",
  },
  {
    addr: "0x742d35cc6634c0532925a3b844bc454e4438f44e",
    desc: "Valid Lowercase",
  },
  {
    addr: "0x742D35CC6634C0532925A3B844BC454E4438F44E",
    desc: "Valid Uppercase",
  },
  {
    addr: "0x742d35cc6634c0532925a3b844bc454e4438f44g",
    desc: "Invalid Char (g)",
  },
  {
    addr: "0x742d35cc6634c0532925a3b844bc454e4438f44",
    desc: "Short (41 chars)",
  },
  { addr: "742d35cc6634c0532925a3b844bc454e4438f44e", desc: "Missing 0x" },
  {
    addr: "0x742d35cc6634c0532925a3b844bc454e4438f44E",
    desc: "Invalid Checksum",
  }, // Mixed case but wrong checksum
];

console.log("--- NΞØ Address Validation Test ---");
testAddresses.forEach(({ addr, desc }) => {
  const result = validateAddress(addr);
  console.log(`\nAddress: ${addr}`);
  console.log(`Description: ${desc}`);
  console.log(`Valid: ${result.valid ? "✅" : "❌"}`);
  if (result.valid) {
    console.log(`Normalized: ${result.normalized}`);
  } else {
    console.log(`Error: ${result.error}`);
  }
});
