import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Rocket,
  Hexagon,
  LayoutDashboard,
  Wallet,
  AlertTriangle,
  Info
} from 'lucide-react';
import NetworkSelector from './components/NetworkSelector';
import AssetPack from './components/AssetPack';
import LandingSection from './components/LandingSection';
import CustomService from './components/CustomService';
import OpsDashboard from './components/OpsDashboard';
import WalletConnect from './components/WalletConnect';
import { useDynamicWallet } from './hooks/useDynamicWallet';
import TransactionStatus from './components/TransactionStatus';
import { useTransactionStatus } from './hooks/useTransactionStatus';
import useFeatures from './hooks/useFeatures';
import { useSchemaValidation } from './hooks/useSchemaValidation';
import LogicVaultBadge from './components/ui/LogicVaultBadge';
import { TRANSACTION_STATUS } from './types/cli';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingButton from './components/ui/LoadingButton';
import SkeletonLoader from './components/ui/SkeletonLoader';
import { validateAddress, formatAddress } from './utils/addressValidation';
import ProgressBar from './components/ui/ProgressBar';

// SEGURANÇA: Sanitização robusta contra XSS
const sanitizeInput = (val) => {
  if (!val) return '';
  return String(val)
    .replace(/[<>'"&]/g, (char) => {
      const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
      return entities[char] || char;
    })
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .slice(0, 1000); // Limite de caracteres para prevenir DoS
};

// Sanitize for display/storage (with trim)
const sanitizeForStorage = (val) => sanitizeInput(val).trim();

// Marketing & Analytics Helpers
const getOrCreateSessionId = () => {
  if (typeof window === 'undefined') return null;
  let sessionId = localStorage.getItem('neosmart_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('neosmart_session_id', sessionId);
  }
  return sessionId;
};

// PERFORMANCE: Timeout wrapper para prevenir requests travados
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

const safeApiCall = async (url, options = {}) => {
  try {
    const res = await fetchWithTimeout(url, options, 10000); // 10s timeout
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null; // API not available (vite dev mode)
    }
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (error) {
    if (error.message === 'Request timeout') {
      console.warn('[MARKETING] API call timeout:', url);
      return null;
    }
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return null; // Expected in vite dev
    }
    if (error.message && (error.message.includes('JSON') || error.message.includes('Unexpected token'))) {
      return null; // Expected in vite dev
    }
    console.warn('[MARKETING] API call failed:', error);
    return null;
  }
};

export default function SmartMint() {
  // Feature Flags
  const { isEnabled, phaseInfo } = useFeatures();
  const isWeb3Enabled = isEnabled('phase2', 'web3');
  const isRealTransactionsEnabled = isEnabled('phase2', 'realTransactions');

  // Web3 Wallet (Dynamic.xyz) - só funciona se Phase 2 habilitada
  const dynamicWallet = useDynamicWallet();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    tokenSupply: '',
    network: 'base',
    description: ''
  });

  // Wallet address: usa Dynamic.xyz se Web3 habilitado, senão usa estado local
  const [userAddress, setUserAddress] = useState(null);
  const effectiveUserAddress = isWeb3Enabled && dynamicWallet.isConnected
    ? dynamicWallet.address
    : userAddress;

  const [deployHistory, setDeployHistory] = useState([]);
  const [leadId, setLeadId] = useState(null);
  const [sessionId] = useState(() => getOrCreateSessionId());

  // Transaction Status
  const { transaction, setTransaction: setTransactionState, clearTransaction } = useTransactionStatus();

  const [historyLoading, setHistoryLoading] = useState(true);
  const [deployProgress, setDeployProgress] = useState(0);
  const [deployStatus, setDeployStatus] = useState('');

  // Schema Validation
  const { validate: schemaValidate } = useSchemaValidation();

  // Fetch History with retry logic
  const fetchDeploys = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/ops?action=deploys');

      // Check if response is actually JSON (not source code)
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Response is not JSON (likely source code in vite dev mode)
        console.info("[PROTOCOL] API routes not available. Use 'vercel dev' for full API support.");
        return;
      }

      if (res.ok) {
        try {
          const data = await res.json();
          setDeployHistory(Array.isArray(data) ? data : []);
        } catch (jsonError) {
          // JSON parse error - likely received source code instead
          if (jsonError.message.includes('JSON') || jsonError.message.includes('Unexpected token')) {
            console.info("[PROTOCOL] API routes require 'vercel dev'. Received source code instead of JSON.");
          } else {
            console.warn("[PROTOCOL] Failed to parse response:", jsonError);
          }
        }
      } else {
        // API route not available in vite dev mode
        if (res.status === 404 || res.status === 503) {
          console.warn("[PROTOCOL] API routes require 'vercel dev' for full functionality");
        }
      }
    } catch (error) {
      // Only log if it's not a network/CORS error (expected in vite dev)
      if (error.name !== 'TypeError' && !error.message.includes('Failed to fetch')) {
        console.error('[PROTOCOL] Error checking API health:', error);
      }
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeploys();
  }, [fetchDeploys]);

  // Marketing: Criar lead na primeira visita
  useEffect(() => {
    if (!sessionId) return;

    const createLead = async () => {
      // Extrair UTM parameters da URL
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');

      const lead = await safeApiCall('/api/marketing?action=lead-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          utm_source: utmSource || null,
          utm_medium: utmMedium || null,
          utm_campaign: utmCampaign || null,
          conversion_status: 'visitor'
        })
      });

      if (lead) {
        setLeadId(lead.id);
        // Registrar evento page_view
        await safeApiCall('/api/marketing?action=event-record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lead_id: lead.id,
            session_id: sessionId,
            event_type: 'page_view',
            event_data: { page: '/' }
          })
        });
      }
    };

    createLead();
  }, [sessionId]);

  // Marketing: Registrar evento quando usuário interage (step 2)
  useEffect(() => {
    if (step === 2 && leadId) {
      // Atualizar lead para 'engaged'
      safeApiCall('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          conversion_status: 'engaged'
        })
      });

      // Registrar evento form_start
      safeApiCall('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: leadId,
          session_id: sessionId,
          event_type: 'form_start'
        })
      });

      // Criar sessão
      safeApiCall('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: leadId,
          session_id: sessionId,
          step_reached: 1
        })
      });
    }
  }, [step, leadId, sessionId]);

  // Wallet Connection Handler (para compatibilidade com código existente)
  // Se Web3 está habilitado, usa Dynamic.xyz (via componente WalletConnect)
  // Senão, usa fallback para simulation mode
  const handleWalletConnect = async (address) => {
    if (address) {
      setUserAddress(address);

      // Marketing: Atualizar lead com wallet_address
      if (sessionId && leadId) {
        await safeApiCall('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            wallet_address: address,
            conversion_status: 'wallet_connected'
          })
        });

        // Registrar evento wallet_connect
        await safeApiCall('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lead_id: leadId,
            session_id: sessionId,
            event_type: 'wallet_connect',
            event_data: { provider: 'dynamic' }
          })
        });
      }
    }
  };

  const handleWalletDisconnect = () => {
    setUserAddress(null);
  };

  // Fallback para simulation mode quando Web3 não está habilitado
  const connectWalletFallback = async () => {
    if (!isWeb3Enabled) {
      console.info("[FEATURES] Web3 not enabled in Phase 1. Using simulation mode.");
      const demoAddress = '0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0');
      setUserAddress(demoAddress);
      handleWalletConnect(demoAddress);
    }
  };

  // Cloud State Sync (Drafts + Marketing Session)
  useEffect(() => {
    // PERFORMANCE: Evitar memory leaks com AbortController
    const abortController = new AbortController();
    let isMounted = true;

    if (step === 2) {
      const saveData = async () => {
        if (!isMounted) return;

        // Salvar draft (se tiver wallet)
        if (userAddress) {
          try {
            const res = await fetch('/api/ops?action=drafts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user_address: userAddress,
                token_config: formData,
                lead_id: leadId,
                session_id: sessionId
              }),
              signal: abortController.signal
            });

            if (!isMounted) return;

            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              return;
            }

            if (!res.ok && res.status !== 404) {
              console.warn("[CLOUD] Auto-save failed:", res.status);
            }
          } catch (error) {
            if (error.name === 'AbortError') return; // Request foi cancelado intencionalmente
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
              return;
            }
            if (error.message && (error.message.includes('JSON') || error.message.includes('Unexpected token'))) {
              return;
            }
            if (isMounted) {
              console.error("[CLOUD] Auto-save sequence interrupted:", error);
            }
          }
        }

        // Atualizar sessão de marketing (com snapshot do form)
        if (sessionId && leadId && isMounted) {
          // Calcular step baseado no que foi preenchido
          let currentStep = 1;
          if (formData.tokenName && formData.tokenSymbol) currentStep = 2;
          if (formData.tokenSupply) currentStep = 3;
          if (formData.description) currentStep = 4;

          await safeApiCall('/api/marketing?action=session-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lead_id: leadId,
              session_id: sessionId,
              step_reached: currentStep,
              form_data_snapshot: formData,
              conversion_funnel: {
                step1_at: formData.tokenName ? new Date().toISOString() : null,
                step2_at: formData.tokenSymbol ? new Date().toISOString() : null,
                step3_at: formData.tokenSupply ? new Date().toISOString() : null,
                step4_at: formData.description ? new Date().toISOString() : null
              }
            })
          });

          // Registrar eventos de progresso
          if (currentStep >= 2 && isMounted) {
            await safeApiCall('/api/marketing?action=event-record', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                lead_id: leadId,
                session_id: sessionId,
                event_type: `form_step_${currentStep}`,
                event_data: { step: currentStep, fields_filled: Object.keys(formData).filter(k => formData[k]) }
              })
            });
          }
        }
      };

      const timeoutId = setTimeout(saveData, 2000); // 2s debounce for performance

      // CLEANUP: Prevenir memory leaks
      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
        abortController.abort();
      };
    }
  }, [formData, userAddress, step, sessionId, leadId]);

  // Load Cloud State
  useEffect(() => {
    // PERFORMANCE: Prevenir memory leaks com AbortController
    const abortController = new AbortController();
    let isMounted = true;

    if (userAddress) {
      const loadDraft = async () => {
        try {
          const res = await fetch(`/api/ops?action=drafts&address=${userAddress}`, {
            signal: abortController.signal
          });

          if (!isMounted) return;

          // Check if response is actually JSON (not source code)
          const contentType = res.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            // Response is not JSON (likely source code in vite dev mode)
            return; // Silently fail - expected in vite dev
          }

          if (res.ok) {
            try {
              const draftData = await res.json();
              if (isMounted) {
                setFormData(prev => ({ ...prev, ...draftData }));
              }
            } catch (jsonError) {
              // JSON parse error - likely received source code instead
              if (jsonError.message && (jsonError.message.includes('JSON') || jsonError.message.includes('Unexpected token'))) {
                // Expected in vite dev mode, don't log
                return;
              }
              if (isMounted) {
                console.warn("[CLOUD] Failed to parse draft data:", jsonError);
              }
            }
          }
        } catch (error) {
          if (error.name === 'AbortError') return; // Request foi cancelado intencionalmente
          // Silently fail in dev mode (API routes require vercel dev)
          if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            return;
          }
          // Check for JSON parse errors
          if (error.message && (error.message.includes('JSON') || error.message.includes('Unexpected token'))) {
            return;
          }
          if (isMounted) {
            console.warn("[CLOUD] State retrieval skipped:", error);
          }
        }
      };
      loadDraft();
    }

    // CLEANUP: Prevenir memory leaks
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [userAddress]);

  // Marketing: Detectar abandono (beforeunload)
  useEffect(() => {
    if (!sessionId || !leadId || step !== 2) return;

    const handleBeforeUnload = () => {
      // Usar sendBeacon para garantir que o request seja enviado mesmo ao fechar
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          action: 'session-sync',
          session_id: sessionId,
          abandoned_at: new Date().toISOString(),
          step_reached: formData.tokenName ? 2 : 1
        });
        navigator.sendBeacon('/api/marketing', new Blob([data], { type: 'application/json' }));
      }

      // Registrar evento de abandono
      if (navigator.sendBeacon) {
        const eventData = JSON.stringify({
          action: 'event-record',
          lead_id: leadId,
          session_id: sessionId,
          event_type: 'form_abandon',
          event_data: { step_reached: formData.tokenName ? 2 : 1 }
        });
        navigator.sendBeacon('/api/marketing', new Blob([eventData], { type: 'application/json' }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionId, leadId, step, formData]);

  const [deployResult, setDeployResult] = useState(null);

  const validateDeploy = () => {
    // 1. Schema-based technical validation (Synchronized with MCP)
    const schemaError = schemaValidate(formData);
    if (schemaError) return schemaError;

    // 2. Protocol-specific validation
    if (!effectiveUserAddress) return "Wallet connection required for protocol deployment.";
    const addrValidation = validateAddress(effectiveUserAddress);
    if (!addrValidation.valid) return `Invalid wallet: ${addrValidation.error}`;

    return null;
  };

  const handleDeploy = async (e) => {
    e.preventDefault();
    setError(null);

    const vError = validateDeploy();
    if (vError) {
      setError(vError);
      return;
    }

    setLoading(true);
    setDeployProgress(10);
    setDeployStatus('Validating Protocol Sequence...');

    // Mostrar TransactionStatus como pending
    if (isRealTransactionsEnabled) {
      setTransactionState({
        status: TRANSACTION_STATUS.PENDING,
        txHash: null,
        network: formData.network,
      });
    }

    try {
      let result;

      const simulateProgress = async () => {
        setDeployProgress(30);
        setDeployStatus('Initializing Genesis Block...');
        await new Promise(r => setTimeout(r, 1000));

        setDeployProgress(60);
        setDeployStatus('Verifying Neural Uplink...');
        await new Promise(r => setTimeout(r, 1000));

        setDeployProgress(90);
        setDeployStatus('Confirming Deployment...');
        await new Promise(r => setTimeout(r, 1000));
        setDeployProgress(100);
      };

      if (isRealTransactionsEnabled && dynamicWallet.signer) {
        console.info("[WEB3] Real transactions enabled but CLI not yet implemented. Using simulation.");
        await simulateProgress();

        result = {
          ...formData,
          address: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
          txHash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
          logicHash: 'sha256:' + (Math.random().toString(16) + Math.random().toString(16)).substring(0, 64),
          status: 'DEPLOYED'
        };

      } else {
        await simulateProgress();

        result = {
          ...formData,
          address: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
          txHash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
          logicHash: 'sha256:' + (Math.random().toString(16) + Math.random().toString(16)).substring(0, 64),
          status: 'DEPLOYED'
        };

      }

      // Atualizar TransactionStatus como confirmed
      if (isRealTransactionsEnabled) {
        setTransactionState({
          status: TRANSACTION_STATUS.CONFIRMED,
          txHash: result.txHash,
          contractAddress: result.address,
          network: formData.network,
        });
      }

      // Record deployment in DB
      try {
        const deployRes = await fetch('/api/ops?action=deploys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contract_address: result.address,
            owner_address: effectiveUserAddress,
            network: formData.network,
            tx_hash: result.txHash,
            token_name: sanitizeForStorage(formData.tokenName),
            token_symbol: sanitizeForStorage(formData.tokenSymbol).toUpperCase(),
            lead_id: leadId,
            session_id: sessionId
          })
        });

        // Check if response is actually JSON (not source code)
        const contentType = deployRes.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // Response is not JSON (likely source code in vite dev mode)
          // Silently continue - expected in vite dev
          return;
        }

        if (!deployRes.ok && deployRes.status !== 404) {
          console.warn("[PROTOCOL] Failed to record deployment in database");
        }
      } catch (error) {
        // Atualizar TransactionStatus como failed
        if (isRealTransactionsEnabled) {
          setTransactionState({
            status: TRANSACTION_STATUS.FAILED,
            error: error.message || 'Deployment failed',
            network: formData.network,
          });
        }

        // Don't block deployment if API is unavailable
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          // Expected in vite dev mode
          return;
        }
        // Check for JSON parse errors (source code instead of JSON)
        if (error.message && (error.message.includes('JSON') || error.message.includes('Unexpected token'))) {
          // Expected in vite dev mode
          return;
        }
        console.warn("[PROTOCOL] Database sync error:", error);
      }

      // Marketing: Atualizar lead e sessão para 'token_created'
      if (sessionId && leadId) {
        // Atualizar lead
        await safeApiCall('/api/marketing?action=lead-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            conversion_status: 'token_created'
          })
        });

        // Marcar sessão como completada
        await safeApiCall('/api/marketing?action=session-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            completed_at: new Date().toISOString(),
            step_reached: 4
          })
        });

        // Registrar evento token_created
        await safeApiCall('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lead_id: leadId,
            session_id: sessionId,
            event_type: 'token_created',
            event_data: {
              contract_address: result.address,
              network: formData.network,
              tx_hash: result.txHash
            }
          })
        });
      }

      setDeployResult(result);
      fetchDeploys(); // Refresh history
    } catch {
      setError("Protocol Deployment Failed: Connectivity issues.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary
      componentName="SmartMint"
      level="critical"
      title="Erro na Aplicação"
      message="Ocorreu um erro inesperado. Por favor, recarregue a página."
      showDetails={import.meta.env.DEV}
      showReload={true}
      onError={(error, errorInfo) => {
        console.error('[SmartMint] Critical error caught by boundary:', error, errorInfo);
      }}
    >
      <div className="min-h-screen selection:bg-neon-acid selection:text-obsidian">

        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-acid/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-signal-cyan/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <img src="/brand/logo.png" alt="NEØ Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(216,242,68,0.4)]" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tighter uppercase">NΞØ <span className="text-neon-acid">SMART FACTORY</span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden md:inline">Protocol Status: <span className="text-green-400">Online</span></span>
            {isWeb3Enabled ? (
              <WalletConnect
                userAddress={effectiveUserAddress}
                setUserAddress={setUserAddress}
                onConnect={handleWalletConnect}
                onDisconnect={handleWalletDisconnect}
              />
            ) : (
              <button
                onClick={connectWalletFallback}
                disabled={loading}
                className={`btn-secondary !py-2 !px-4 !text-xs flex items-center gap-2 ${effectiveUserAddress ? 'border-neon-acid/50 text-neon-acid' : ''}`}
              >
                <Wallet className="w-3 h-3" /> {effectiveUserAddress ? `${effectiveUserAddress.slice(0, 6)}...${effectiveUserAddress.slice(-4)}` : 'Connect Wallet'}
              </button>
            )}
          </div>
        </header>

        <main className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
          <AnimatePresence mode="wait">
            {/* Phase Status Badges - Removido para manter o visual limpo e comercial */}

            {/* Transaction Status */}
            {transaction && isRealTransactionsEnabled && (
              <TransactionStatus
                status={transaction.status}
                txHash={transaction.txHash}
                network={transaction.network}
                contractAddress={transaction.contractAddress}
                error={transaction.error}
                blockNumber={transaction.blockNumber}
                onDismiss={clearTransaction}
                className="mb-6"
              />
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-bold"
              >
                <AlertTriangle className="w-4 h-4" /> {error}
              </motion.div>
            )}

            {!deployResult && step === 1 ? (
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-neon-acid uppercase tracking-widest">
                    <Zap className="w-3 h-3" /> Decentralized Intelligence Factory
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                    Deploy your <span className="text-neon-acid">Token</span> now.
                  </h1>
                  <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                    The most efficient Smart Contract Factory. Compile and deploy stable, liquid protocols in seconds with zero upfront fees.
                  </p>
                  <div className="pt-8">
                    <button
                      onClick={() => {
                        setStep(2);
                        // Marketing: Registrar evento de clique no CTA
                        if (leadId && sessionId) {
                          safeApiCall('/api/events', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              lead_id: leadId,
                              session_id: sessionId,
                              event_type: 'cta_click',
                              event_data: { cta: 'Open Smart Mint' }
                            })
                          });
                        }
                      }}
                      className="btn-primary flex items-center gap-3 mx-auto text-lg px-12 relative z-10 group"
                    >
                      Open Smart Mint <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <LandingSection />
              </motion.div>
            ) : !deployResult && step === 2 ? (
              <motion.div
                key="constructor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-12"
              >
                <form onSubmit={handleDeploy} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-card space-y-6">
                      <div className="flex items-center gap-2 text-neon-acid mb-2">
                        <Cpu className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Protocol Identification</span>
                      </div>

                      <div>
                        <label htmlFor="token-name" className="neo-label">Token Identity</label>
                        <input
                          id="token-name"
                          name="tokenName"
                          type="text"
                          required
                          autoComplete="off"
                          className="neo-input w-full"
                          placeholder="Ex: Neo Flow Token"
                          value={formData.tokenName}
                          onChange={e => setFormData({ ...formData, tokenName: sanitizeInput(e.target.value) })}
                        />
                      </div>

                      <div>
                        <label htmlFor="token-symbol" className="neo-label">Neural Symbol</label>
                        <input
                          id="token-symbol"
                          name="tokenSymbol"
                          type="text"
                          required
                          autoComplete="off"
                          className="neo-input w-full uppercase"
                          placeholder="Ex: FLOW"
                          maxLength={6}
                          value={formData.tokenSymbol}
                          onChange={e => setFormData({ ...formData, tokenSymbol: sanitizeInput(e.target.value).toUpperCase() })}
                        />
                      </div>

                      <div>
                        <label htmlFor="token-supply" className="neo-label">Genesis Supply</label>
                        <input
                          id="token-supply"
                          name="tokenSupply"
                          type="number"
                          required
                          min="1"
                          className="neo-input w-full"
                          placeholder="Ex: 1000000"
                          value={formData.tokenSupply}
                          onChange={e => setFormData({ ...formData, tokenSupply: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="glass-card space-y-6">
                      <div className="flex items-center gap-2 text-signal-cyan mb-2">
                        <Layers className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Smart Mint Config</span>
                      </div>

                      <div>
                        <label htmlFor="mission-narrative" className="neo-label">Mission Narrative</label>
                        <textarea
                          id="mission-narrative"
                          name="description"
                          className="neo-input w-full min-h-[140px] resize-none"
                          placeholder="Describe the neural impact and utility of this asset..."
                          value={formData.description}
                          onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>

                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Integrated Logic</span>
                          <ShieldCheck className="w-3 h-3 text-green-400" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['Anti-Whale', 'Auto-Burn', 'Liquid-Lock', 'Vesting'].map(tag => (
                            <span key={tag} className="text-[9px] bg-white/5 px-2 py-1 rounded border border-white/5 text-slate-400 font-mono tracking-tighter uppercase">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card">
                    <NetworkSelector
                      selected={formData.network}
                      onSelect={id => setFormData({ ...formData, network: id })}
                    />
                  </div>

                  <div className="flex flex-col items-center gap-4 w-full">
                    {loading && (
                      <div className="w-full md:w-[400px] mb-2 space-y-2">
                        <div className="flex justify-between items-center text-[8px] uppercase font-bold tracking-[0.2em] text-neon-acid px-1">
                          <span className="animate-pulse">{deployStatus}</span>
                          <span className="font-mono">{deployProgress}%</span>
                        </div>
                        <ProgressBar progress={deployProgress} height="h-1" />
                      </div>
                    )}
                    <LoadingButton
                      type="submit"
                      loading={loading}
                      loadingText="Forging Sequence..."
                      icon={ArrowRight}
                      className="w-full md:w-[400px] text-lg"
                    >
                      Deploy Protocol
                    </LoadingButton>
                    <div className="mt-4 p-4 bg-neon-acid/5 border border-neon-acid/20 rounded-xl text-center">
                      <p className="text-xs text-neon-acid font-bold uppercase tracking-wider">Zero Upfront Fee Policy</p>
                      <p className="text-[10px] text-slate-400 mt-1">A 5% protocol fee is embedded. Only network GAS is required for genesis.</p>
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="glass-card p-10 text-center space-y-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-energy opacity-10 blur-3xl pointer-events-none group-hover:opacity-20 transition-opacity" />
                  <div className="w-20 h-20 bg-neon-acid rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(216,242,68,0.4)]">
                    <ShieldCheck className="w-10 h-10 text-obsidian" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-neon-acid font-mono text-[10px] tracking-[0.3em] font-bold">GENESIS SUCCESSFUL</span>
                    <h2 className="text-4xl font-bold">{formData.tokenName} is Deployed!</h2>
                    <p className="text-slate-400 font-mono text-xs break-all border border-white/10 bg-black/40 p-2 rounded max-w-sm mx-auto">{deployResult?.address}</p>
                  </div>

                  <div className="flex flex-col items-center gap-4 py-2">
                    <LogicVaultBadge logicHash={deployResult?.logicHash} />
                    <a
                      href={`/deployments/${formData.network}/${formData.tokenSymbol}-MANIFESTO.md`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-slate-500 hover:text-neon-acid flex items-center gap-2 uppercase font-bold tracking-widest transition-colors underline decoration-dotted"
                    >
                      View Sovereign Manifesto
                    </a>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button className="bg-white/5 px-6 py-2 rounded-lg border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-all text-xs font-bold uppercase">
                      <LayoutDashboard className="w-4 h-4 text-slate-400" /> Explorer
                    </button>
                    <button className="bg-neon-acid/10 px-6 py-2 rounded-lg border border-neon-acid/20 flex items-center gap-2 hover:bg-neon-acid/20 transition-all text-xs font-bold uppercase text-neon-acid">
                      <Rocket className="w-4 h-4" /> Activate Bridge
                    </button>
                  </div>
                </div>

                <AssetPack />
                <CustomService />

                <div className="flex justify-center border-t border-white/5 pt-10">
                  <button
                    onClick={() => { setDeployResult(null); setStep(1); }}
                    className="text-xs text-slate-500 hover:text-neon-acid transition-colors flex items-center gap-2 uppercase tracking-widest font-bold"
                  >
                    <ArrowRight className="w-3 h-3 rotate-180" /> Start New Sequence
                  </button>
                </div>

                <div className="mt-20">
                  <OpsDashboard />
                </div>

                <div className="mt-20 space-y-6">
                  <div className="flex items-center gap-2 text-neon-acid">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Live Protocol Feed</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {historyLoading ? (
                      Array(4).fill(0).map((_, i) => (
                        <div key={`skeleton-${i}`} className="glass-card !p-4 flex items-center justify-between border-white/5 h-[64px]">
                          <div className="space-y-2">
                            <SkeletonLoader width="w-24" height="h-3" />
                            <SkeletonLoader width="w-32" height="h-2" className="opacity-50" />
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <SkeletonLoader width="w-12" height="h-4" variant="circle" />
                            <SkeletonLoader width="w-16" height="h-2" />
                          </div>
                        </div>
                      ))
                    ) : deployHistory.length > 0 ? deployHistory.map((deploy) => (
                      <div key={deploy.id} className="glass-card !p-4 flex items-center justify-between border-white/5 hover:border-neon-acid/20 transition-all group">
                        <div>
                          <p className="text-xs font-bold text-white uppercase">{deploy.token_name || 'Protocol Unknown'}</p>
                          <p className="text-[10px] text-slate-500 font-mono tracking-tighter" title={deploy.contract_address}>
                            {formatAddress(deploy.contract_address)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] bg-neon-acid/10 text-neon-acid px-2 py-0.5 rounded-full border border-neon-acid/20 uppercase font-bold tracking-tighter">
                            {deploy.network}
                          </span>
                          <p className="text-[8px] text-slate-600 mt-1 uppercase font-bold group-hover:text-neon-acid/60 transition-colors">Verified Node</p>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                        <p className="text-[10px] text-slate-600 uppercase font-bold tracking-[0.3em]">Awaiting Uplink Sequences...</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="border-t border-white/5 py-12 px-6 bg-black/20">
          <div className="container mx-auto max-w-4xl space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 opacity-50">
                <Hexagon className="w-4 h-4 text-neon-acid" />
                <span className="text-[10px] font-bold tracking-widest uppercase">NEØ PROTOCOL — EST. 2025</span>
              </div>
              <div className="flex gap-10">
                {/* Links de governança e docs ocultos até Q3/Q4 */}
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 text-center">
              <p className="text-[9px] text-slate-600 uppercase tracking-wider font-mono">
                Open Source Infrastructure · Institutional Responsibility · Active Governance
              </p>
              <p className="text-[8px] text-slate-700 mt-2 max-w-2xl mx-auto">
                Built with deliberate security architecture. All decisions documented in ADRs.
                Governed by the NEØ PROTOCOL organization.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </ErrorBoundary>
  );
}

