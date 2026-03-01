## 🌐 Implement Network Mismatch Detection and Handling

**Priority:** High  
**Status:** Open  
**Phase:** Phase 02 Blocker  
**Category:** Web3/Blockchain

---

## 📋 Problem Summary

Currently, the application doesn't detect or handle network mismatches. Users can be connected to the wrong blockchain network (e.g., Ethereum Mainnet when Base is required), leading to failed transactions or incorrect behavior.

### Current State

- ❌ No network detection
- ❌ No validation of current network vs required network
- ❌ No prompt to switch networks
- ❌ No warning when network is incorrect
- ❌ Transactions may fail silently or with confusing errors

### Impact

**User Experience:**

- Failed transactions without clear reason
- Confusion about which network to use
- Lost gas fees on wrong network
- Poor error messages

**Technical:**

- Transactions sent to wrong network
- Contract addresses may not exist on wrong network
- RPC calls may fail or return wrong data

---

## 🎯 Objectives

1. **Detect current network**

   - Get chainId from connected wallet
   - Compare with required network

2. **Show network mismatch warning**

   - Display clear warning when network is wrong
   - Show current network vs required network
   - Provide switch network button

3. **Implement network switching**

   - Prompt user to switch to correct network
   - Handle network switch via wallet
   - Validate network after switch

4. **Add network validation**
   - Validate network before transactions
   - Show network status in UI
   - Prevent transactions on wrong network

---

## 📚 References

- Audit Report: `WALLET_CONNECTION_AUDIT_PHASE01.md` (lines 161-169, 224-233)
- Dynamic.xyz Network Switching: https://docs.dynamic.xyz/docs/network-switching
- Ethers.js Network Detection: https://docs.ethers.org/v6/api/providers/

---

## 🔧 Implementation Plan

### Phase 1: Network Detection Hook

**File:** `src/hooks/useNetwork.js`

```jsx
export function useNetwork() {
  const { primaryWallet } = useDynamicContext();
  const [currentChainId, setCurrentChainId] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const SUPPORTED_NETWORKS = {
    base: 8453,
    polygon: 137,
    ethereum: 1,
  };

  const requiredNetwork = SUPPORTED_NETWORKS.base; // Default to Base

  useEffect(() => {
    // Get current chainId from wallet
    // Compare with required network
    // Update state
  }, [primaryWallet]);

  return {
    currentChainId,
    requiredNetwork,
    isCorrectNetwork,
    switchNetwork: async () => {
      // Implement network switching
    },
  };
}
```

### Phase 2: Network Mismatch Component

**File:** `src/components/NetworkMismatchWarning.jsx`

```jsx
export default function NetworkMismatchWarning({
  currentChainId,
  requiredChainId,
  onSwitchNetwork,
}) {
  const networkNames = {
    8453: "Base",
    137: "Polygon",
    1: "Ethereum",
  };

  return (
    <div className="network-mismatch-warning glass-card border-orange-500/20 p-4">
      <AlertTriangle className="w-5 h-5 text-orange-400" />
      <h3>Rede Incorreta</h3>
      <p>
        Você está conectado à {networkNames[currentChainId]}, mas precisa estar
        em {networkNames[requiredChainId]}.
      </p>
      <button onClick={onSwitchNetwork}>
        Trocar para {networkNames[requiredChainId]}
      </button>
    </div>
  );
}
```

### Phase 3: Integration

- Add network detection to WalletConnect
- Show warning when network is wrong
- Prevent transactions on wrong network
- Add network status indicator

---

## ✅ Success Criteria

- [ ] Network detection hook created
- [ ] Network mismatch warning component created
- [ ] Network switching implemented
- [ ] Network validation before transactions
- [ ] Clear error messages for wrong network
- [ ] Network status shown in UI
- [ ] Tests for network detection

---

**Estimated Time:** 6-8 hours  
**Complexity:** Medium-High  
**Dependencies:** Wallet connection working (Phase 02)
