/**
 * NΞØ Protocol — Shared Ecosystem Constants
 */

module.exports = {
  VERSION: "0.5.3",
  CODENAME: "MULTICHAIN FOUNDATION",

  NETWORKS: {
    BASE: {
      chainId: 8453,
      name: "Base",
      rpc: "https://mainnet.base.org",
      explorer: "https://basescan.org",
    },
    POLYGON: {
      chainId: 137,
      name: "Polygon",
      rpc: "https://polygon-rpc.com",
      explorer: "https://polygonscan.com",
    },
    MINT_CHAIN: {
      chainId: 185,
      name: "Mint Chain",
      rpc: "https://rpc.mintchain.io",
      explorer: "https://explorer.mintchain.io",
    },
  },

  FEES_BPS: 500, // 5% Fee for NEØ Treasury

  TREASURY_ADDRESS: "0x071B36BcE6A1e1693A864B933275Fc3775FC7cC9", // NEØ Multisig placeholder
};
