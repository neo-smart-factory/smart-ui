## 🛡️ Implement Error Boundaries for Wallet Connection & Critical Components

**Priority:** High  
**Status:** Open  
**Phase:** Phase 01 → Phase 02 Preparation  
**Category:** UX/Error Handling

---

## 📋 Problem Summary

Currently, the application has **no error boundaries** to catch and handle React errors gracefully. If an error occurs in the wallet connection flow or any critical component, it can crash the entire application, leaving users with a blank screen.

### Current State

- ❌ No ErrorBoundary components exist
- ❌ Unhandled errors crash the entire UI
- ❌ Users lose context and progress on errors
- ❌ No fallback UI for error states
- ❌ Errors not logged to monitoring (Sentry)

### Impact

**User Experience:**

- Poor error recovery
- Lost user progress
- Confusing blank screens
- No way to retry failed operations

**Development:**

- Difficult to debug production errors
- No error tracking/analytics
- Missing error context

---

## 🎯 Objectives

1. **Create reusable ErrorBoundary component**
2. **Wrap critical components** (WalletConnect, TransactionStatus, etc.)
3. **Add error logging** to Sentry (if configured)
4. **Implement graceful fallback UIs**
5. **Add retry mechanisms** where appropriate
6. **Document error handling patterns**

---

## 📚 References

- Audit Report: `WALLET_CONNECTION_AUDIT_PHASE01.md` (lines 332-368)
- Security Summary: `SECURITY_SUMMARY.md` (Error Boundaries section)
- React Error Boundaries: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

---

## 🔧 Implementation Plan

### Phase 1: Core ErrorBoundary Component

**File:** `src/components/ErrorBoundary.jsx`

**Features:**

- Class component with `componentDidCatch` and `getDerivedStateFromError`
- Configurable fallback UI
- Error logging to console and Sentry
- Reset functionality
- Customizable error messages

**Props:**

```jsx
<ErrorBoundary
  fallback={<CustomErrorUI />}
  onError={(error, errorInfo) => {}}
  resetKeys={[someState]}
  level="critical" | "warning"
>
  {children}
</ErrorBoundary>
```

### Phase 2: Wrap Critical Components

**Components to wrap:**

1. `WalletConnect` - Wallet connection errors
2. `TransactionStatus` - Transaction errors
3. `App.jsx` (main SmartMint) - Global fallback
4. `OpsDashboard` - API errors
5. `AssetPack` - Asset loading errors

**Implementation:**

```jsx
// Example: WalletConnect
<ErrorBoundary
  fallback={<WalletErrorFallback onRetry={handleRetry} />}
  onError={(error) => logToSentry(error, { component: "WalletConnect" })}
>
  <WalletConnect {...props} />
</ErrorBoundary>
```

### Phase 3: Specialized Error Fallbacks

**Create specific fallback components:**

1. **WalletErrorFallback**

   - Shows wallet connection error
   - Button to retry connection
   - Link to documentation
   - Option to use simulation mode

2. **TransactionErrorFallback**

   - Shows transaction error details
   - Retry button
   - Link to transaction on explorer
   - Support contact

3. **APIErrorFallback**
   - Shows API unavailable message
   - Instructions for local dev
   - Retry button

### Phase 4: Error Logging & Monitoring

**Integrate with Sentry:**

```jsx
componentDidCatch(error, errorInfo) {
  if (window.Sentry) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      },
      tags: {
        component: this.props.componentName,
        level: this.props.level
      }
    });
  }
}
```

### Phase 5: Testing

**Test scenarios:**

- [ ] Wallet connection failure
- [ ] Transaction rejection
- [ ] API timeout
- [ ] Network errors
- [ ] Invalid data errors
- [ ] Component render errors

---

## 📝 Code Examples

### Basic ErrorBoundary

```jsx
// src/components/ErrorBoundary.jsx
import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log to console
    console.error("[ErrorBoundary]", error, errorInfo);

    // Log to Sentry if available
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: { react: { componentStack: errorInfo.componentStack } },
        tags: { component: this.props.componentName || "Unknown" },
      });
    }

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary glass-card border-red-500/20 bg-black/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-red-400">
              {this.props.title || "Algo deu errado"}
            </h3>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            {this.props.message ||
              "Ocorreu um erro inesperado. Por favor, tente novamente."}
          </p>

          {this.props.showDetails && this.state.error && (
            <details className="mb-4">
              <summary className="text-xs text-slate-500 cursor-pointer mb-2">
                Detalhes técnicos
              </summary>
              <pre className="text-[10px] text-slate-500 bg-black/40 p-2 rounded overflow-auto">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <div className="flex gap-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-neon-acid text-black text-xs font-bold rounded hover:opacity-90 flex items-center gap-2"
            >
              <RefreshCw className="w-3 h-3" />
              Tentar Novamente
            </button>

            {this.props.onReload && (
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded hover:opacity-90"
              >
                Recarregar Página
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Wallet-Specific Fallback

```jsx
// src/components/WalletErrorFallback.jsx
import { Wallet, AlertTriangle, RefreshCw } from "lucide-react";

export default function WalletErrorFallback({
  error,
  onRetry,
  onUseSimulation,
}) {
  return (
    <div className="wallet-error-fallback glass-card border-orange-500/20 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Wallet className="w-5 h-5 text-orange-400" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-orange-400">
          Erro na Conexão da Carteira
        </h3>
      </div>

      <p className="text-xs text-slate-400 mb-4">
        Não foi possível conectar sua carteira. Isso pode acontecer se:
      </p>

      <ul className="text-xs text-slate-500 mb-4 space-y-1 list-disc list-inside">
        <li>A extensão da carteira não está instalada</li>
        <li>A conexão foi rejeitada</li>
        <li>Há um problema com a rede</li>
      </ul>

      <div className="flex gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-neon-acid text-black text-xs font-bold rounded hover:opacity-90 flex items-center gap-2"
          >
            <RefreshCw className="w-3 h-3" />
            Tentar Novamente
          </button>
        )}

        {onUseSimulation && (
          <button
            onClick={onUseSimulation}
            className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded hover:opacity-90"
          >
            Usar Modo Simulação
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## ✅ Success Criteria

- [ ] ErrorBoundary component created and tested
- [ ] All critical components wrapped
- [ ] Error logging to Sentry working
- [ ] Graceful fallback UIs implemented
- [ ] Retry mechanisms added
- [ ] Documentation updated
- [ ] No unhandled errors crash the app
- [ ] Error recovery works smoothly

---

## 🧪 Testing Checklist

- [ ] Test wallet connection error
- [ ] Test transaction error
- [ ] Test API error
- [ ] Test network error
- [ ] Test invalid data error
- [ ] Test component render error
- [ ] Verify error logging
- [ ] Verify fallback UI display
- [ ] Verify retry functionality
- [ ] Verify reset functionality

---

## 📊 Expected Impact

**Before:**

- ❌ Errors crash entire app
- ❌ Users see blank screen
- ❌ No error context
- ❌ Poor UX

**After:**

- ✅ Errors caught gracefully
- ✅ Users see helpful error messages
- ✅ Errors logged and tracked
- ✅ Retry options available
- ✅ Better UX and debugging

---

**Estimated Time:** 4-6 hours  
**Complexity:** Medium  
**Dependencies:** None (can be done independently)
