# Simulation Mode Documentation

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Arquitetura  
**Audiência:** Desenvolvedores

---

## Overview

The NΞØ Smart Factory UI includes a **Simulation Mode** that allows users to explore the interface and understand the token deployment workflow without requiring a Web3 wallet or actual blockchain transactions.

## What is Simulated?

### 1. Wallet Connection

When no Web3 wallet (like MetaMask) is detected in the browser:

- A random Ethereum-style address is generated
- Format: `0x` followed by 40 hexadecimal characters
- **Important**: This is NOT a real wallet address and cannot hold actual funds

**Code Location**: `src/App.jsx` - `connectWallet()` function (lines 58-82)

### 2. Token Deployment

When the user clicks "Deploy Token", the deployment is simulated:

- 3-second artificial delay mimics blockchain transaction time
- Random contract address is generated (40 hex characters)
- Random transaction hash is generated (64 hex characters)
- No actual smart contract is deployed to any blockchain
- The simulated deployment is saved to the database

**Code Location**: `src/App.jsx` - `handleDeploy()` function (lines 136-182)

**Warning**: Simulated deployments appear in the deployment history but do not correspond to real blockchain contracts.

## When Does Simulation Mode Activate?

Simulation mode automatically activates when:

1. No `window.ethereum` object is detected (no Web3 wallet installed)
2. User rejects wallet connection request
3. Wallet connection fails for any reason

## UI Indicators

When simulation mode is active, users will see:

- 🟠 **Orange warning banner** at the top of the interface
- Banner text: "⚠️ Simulation Mode Active"
- Explanation that deployments won't create real contracts
- Recommendation to install MetaMask or another Web3 wallet

## Real Web3 Integration (TODO)

To implement real blockchain deployments, the following changes are needed:

### Required Updates:

1. **Web3 Provider Integration** (`src/App.jsx`)

   ```javascript
   // Replace simulation with:
   - Install: ethers.js, wagmi, or web3.js
   - Initialize provider with user's wallet
   - Connect to selected network (Base, Arbitrum, etc.)
   ```

2. **Contract Deployment** (`handleDeploy` function)

   ```javascript
   // Replace setTimeout simulation with:
   - Import contract factory from smart-core ABIs
   - Deploy contract with ethers.ContractFactory
   - Wait for transaction confirmation
   - Listen for TokenCreated events
   - Return real contract address and tx hash
   ```

3. **Network Configuration**

   - Configure RPC endpoints for each supported network
   - Use dRPC or Alchemy API keys from environment variables
   - Handle network switching requests

4. **Transaction Status Tracking**
   - Replace simulated status with real blockchain confirmation count
   - Show pending → confirmed → finalized states
   - Handle transaction failures gracefully

## Environment Variables

Required for real Web3 integration (see `.env.example`):

```
VITE_DYNAMIC_ENVIRONMENT_ID=""         # For Social Login + Wallet
VITE_DRPC_API_KEY=""                   # RPC Provider
VITE_ALCHEMY_ID=""                     # Alternative RPC Provider
```

## Database Impact

**Important**: Simulated deployments ARE written to the database (`deploys` table) with:

- Fake contract address
- Fake transaction hash
- Real network selection
- Real token name/symbol
- User's simulated or real wallet address

This means the deployment history will contain both real and simulated deployments if users switch between modes.

## Recommended Development Workflow

### Local Development (Simulation Mode)

```bash
npm run dev
# Runs Vite dev server on localhost:3000
# API routes won't work (requires Vercel)
# Wallet connections will be simulated
```

### Full Development with API Routes

```bash
vercel dev
# Runs Vercel dev server
# API routes work via serverless functions
# Wallet connections still simulated without MetaMask
```

### Production Deployment

```bash
npm run build
vercel deploy --prod
# Full functionality available
# Users with Web3 wallets get real deployments
# Users without wallets see simulation mode warning
```

## Security Considerations

1. **Database Pollution**: Simulated deployments are saved to the database

   - Consider adding `is_simulated` flag to `deploys` table
   - Filter simulated deployments from production analytics
   - Add cleanup script for test deployments

2. **User Expectations**: Users might not realize deployments are simulated

   - Warning banner is shown in simulation mode
   - Console warnings are logged
   - Consider adding watermark or stronger visual indicators

3. **Gas Cost Estimation**: Simulated mode doesn't show real gas costs
   - Real implementation should estimate gas before deployment
   - Show approximate USD cost based on current gas prices

## Next Steps (From NEXT_STEPS.md)

Phase 1: Web3 Integration is the priority

- [ ] Replace Demo Fallback with Dynamic.xyz SDK
- [ ] Import real ABIs from smart-core
- [ ] Replace setTimeout simulation with contract writes
- [ ] Listen for on-chain TokenCreated events

---

**Last Updated**: January 22, 2026
**Related Files**:

- `src/App.jsx` (main application logic)
- `api/deploys.js` (database recording)
- `docs/NEXT_STEPS.md` (roadmap)
