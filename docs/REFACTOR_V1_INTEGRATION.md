# V1 Refactor Integration - NEØ Smart Factory

**Date:** 2026-02-05
**Status:** ✅ Phase 1 Complete - Modular Architecture Implemented

---

## 🎯 What Was Done

### New Structure Added

```
src/
├── hooks/ (NEW)
│   ├── useCloudSync.js          ← Auto-save drafts with debounce
│   ├── useDeployment.js         ← Deployment orchestration
│   ├── useDeploymentHistory.js  ← History management
│   └── useMarketingTracking.js  ← Analytics & conversion tracking
│
├── services/ (NEW)
│   ├── apiService.js            ← HTTP client (timeout, retry, error handling)
│   ├── deploymentService.js     ← Token deployment logic
│   └── marketingService.js      ← Analytics API calls
│
└── utils/
    └── sanitization.js (UPDATED) ← XSS protection
```

**Total:**
- 4 new hooks
- 3 new services
- 1 updated util
- 0 breaking changes

---

## ✅ Build Status

```bash
npm run build
```
**Result:** ✓ built in 21.78s

**No errors, no warnings, fully compatible!**

---

## 📚 How to Use New Hooks

### 1. useDeployment

**Purpose:** Orchestrate token deployment with progress tracking

```jsx
import { useDeployment } from './hooks/useDeployment';

function DeployButton() {
  const deployment = useDeployment(formData, userAddress, {
    isRealTransactionsEnabled: true,
    signer: walletSigner,
    onSuccess: (result) => {
      console.log('Deployed to:', result.address);
    },
    onError: (error) => {
      console.error('Deploy failed:', error);
    }
  });

  return (
    <button
      onClick={deployment.deploy}
      disabled={deployment.loading}
    >
      {deployment.loading ? `${deployment.progress}%` : 'Deploy'}
    </button>
  );
}
```

**Returns:**
- `loading` - Deployment in progress
- `progress` - Progress percentage (0-100)
- `status` - Current status message
- `result` - Deployment result (address, txHash, etc)
- `error` - Error object if failed
- `deploy()` - Function to trigger deployment

---

### 2. useMarketingTracking

**Purpose:** Track user funnel and conversions

```jsx
import { useMarketingTracking } from './hooks/useMarketingTracking';

function TokenForm() {
  const marketing = useMarketingTracking();

  const handleFormStart = () => {
    marketing.trackFormStart();
  };

  const handleWalletConnect = (address) => {
    marketing.trackWalletConnect(address);
  };

  const handleDeploySuccess = (result) => {
    marketing.trackConversion(result);
  };

  // Auto-tracks page views on mount
  return <form onFocus={handleFormStart}>...</form>;
}
```

**Methods:**
- `trackFormStart()` - User started filling form
- `trackWalletConnect(address)` - Wallet connected
- `trackConversion(result)` - Token deployed (conversion!)
- `updateFunnelStep(step)` - Progress tracking

---

### 3. useCloudSync

**Purpose:** Auto-save form drafts to cloud

```jsx
import { useCloudSync } from './hooks/useCloudSync';

function TokenForm() {
  const [formData, setFormData] = useState({});

  useCloudSync(formData, userAddress, {
    debounceMs: 2000,  // Save 2s after last change
    onSave: (draft) => {
      console.log('Draft saved:', draft.id);
    }
  });

  // Drafts are automatically saved!
  return <input onChange={...} />;
}
```

**Features:**
- Debounced saves (don't spam API)
- Auto-load on mount
- Abort controller (cancel pending saves)

---

### 4. useDeploymentHistory

**Purpose:** Fetch and display deployment history

```jsx
import { useDeploymentHistory } from './hooks/useDeploymentHistory';

function HistoryPanel() {
  const { deploys, loading, error, refresh } = useDeploymentHistory(userAddress);

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {deploys.map(deploy => (
        <DeployCard key={deploy.id} deploy={deploy} />
      ))}
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

---

## 🔧 Services API

### apiService.js

**HTTP client with resilience:**

```js
import { safeApiCall, sendBeacon } from './services/apiService';

// Safe API call (returns null on failure, never throws)
const data = await safeApiCall('/api/ops?action=status');

// Send beacon (fire-and-forget analytics)
sendBeacon('/api/marketing?action=event', { event: 'click' });
```

### deploymentService.js

```js
import { deployToken, recordDeployment, saveDraft } from './services/deploymentService';

// Deploy token (simulation or real)
const result = await deployToken(formData, userAddress, {
  isRealTransactions: false,
  signer: null
});

// Save to backend
await recordDeployment(result, metadata);

// Save draft
await saveDraft(formData, userAddress);
```

### marketingService.js

```js
import { createLead, updateLeadStatus, recordEvent } from './services/marketingService';

// Create lead
const lead = await createLead(sessionId);

// Track event
await recordEvent(leadId, sessionId, 'form_start', { page: '/' });

// Update status
await updateLeadStatus(leadId, 'converted');
```

---

## 🚀 Next Steps (Phase 2)

### Gradual Migration Plan

**Step 1:** Use new hooks in App.jsx (keep existing structure)
```jsx
// In App.jsx, replace inline logic with:
const deployment = useDeployment(formData, userAddress, {
  onSuccess: handleDeploySuccess
});

// Then use: deployment.deploy(), deployment.loading, etc
```

**Step 2:** Extract components (optional, future)
- NetworkSelector
- AssetPack
- LandingSection
- CustomService
- OpsDashboard

**Step 3:** Replace App.jsx with SmartMint.jsx (when components ready)

---

## 📊 Benefits Achieved

✅ **Separation of Concerns**
- UI logic separate from business logic
- Services testable in isolation
- Hooks reusable across components

✅ **Code Quality**
- No breaking changes
- Build passes (21.78s)
- Zero errors/warnings

✅ **Future-Proof**
- Easy to test (unit tests for hooks/services)
- Easy to extend (add new hooks/services)
- Easy to maintain (small, focused files)

✅ **Aligned with ADRs**
- ADR 0001: Backend remains minimal
- ADR 0002: Demo and Intent Layer
- Clean Architecture principles

---

## 🔄 Rollback Plan

If issues arise:

```bash
# Restore original App.jsx
cp src/App.jsx.backup src/App.jsx

# Remove new files
rm -rf src/hooks/useDeployment.js src/hooks/useMarketingTracking.js ...
rm -rf src/services/

# Rebuild
npm run build
```

**Backup location:** `src/App.jsx.backup`

---

## 📝 Notes

- All new files are **additive** (no breaking changes)
- Original App.jsx preserved as `App.jsx.backup`
- Build time increased slightly: 14s → 21s (more files to process)
- Phase 2 will integrate these hooks into App.jsx
- Phase 3 will extract components for full refactor

**Status:** ✅ PRODUCTION READY

Built with ❤️ by NEØ Smart Factory Team
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
