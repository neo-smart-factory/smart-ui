/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  USE MARKETING TRACKING HOOK                             ║
 * ║  Analytics & conversion funnel management                 ║
 * ╚═══════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useRef } from 'react';
import {
  getOrCreateSessionId,
  createLead,
  updateLeadStatus,
  recordEvent,
  updateSession,
  calculateFunnelStep,
  recordAbandonment
} from '../services/marketingService';

export const useMarketingTracking = () => {
  const [sessionId] = useState(() => getOrCreateSessionId());
  const [leadId, setLeadId] = useState(null);
  const isInitialized = useRef(false);
  
  /**
   * Initialize lead on mount
   */
  useEffect(() => {
    if (!sessionId || isInitialized.current) return;
    
    const initLead = async () => {
      const lead = await createLead(sessionId);
      
      if (lead) {
        setLeadId(lead.id);
        
        // Record initial page view
        await recordEvent(lead.id, sessionId, 'page_view', { page: '/' });
      }
      
      isInitialized.current = true;
    };
    
    initLead();
  }, [sessionId]);
  
  /**
   * Track form engagement
   */
  const trackFormStart = async () => {
    if (!leadId || !sessionId) return;
    
    await updateLeadStatus(sessionId, 'engaged');
    await recordEvent(leadId, sessionId, 'form_start');
  };
  
  /**
   * Track wallet connection
   */
  const trackWalletConnect = async (address, provider = 'dynamic') => {
    if (!leadId || !sessionId) return;
    
    await updateLeadStatus(sessionId, 'wallet_connected', { wallet_address: address });
    await recordEvent(leadId, sessionId, 'wallet_connect', { provider });
  };
  
  /**
   * Track CTA click
   */
  const trackCtaClick = async (ctaLabel) => {
    if (!leadId || !sessionId) return;
    
    await recordEvent(leadId, sessionId, 'cta_click', { cta: ctaLabel });
  };
  
  /**
   * Track form progress (debounced)
   */
  const trackFormProgress = async (formData) => {
    if (!leadId || !sessionId) return;
    
    const step = calculateFunnelStep(formData);
    
    await updateSession(leadId, sessionId, step, formData);
    
    if (step >= 2) {
      const filledFields = Object.keys(formData).filter(k => formData[k]);
      await recordEvent(leadId, sessionId, `form_step_${step}`, {
        step,
        fields_filled: filledFields
      });
    }
  };
  
  /**
   * Track form abandonment (on unmount/close)
   */
  const trackAbandonment = (formData) => {
    if (!leadId || !sessionId) return;
    
    const step = calculateFunnelStep(formData);
    recordAbandonment(sessionId, leadId, step);
  };
  
  /**
   * Track conversion (deployment success)
   */
  const trackConversion = async (deploymentData) => {
    if (!leadId || !sessionId) return;
    
    await updateLeadStatus(sessionId, 'token_created');
    await updateSession(leadId, sessionId, 4);
    await recordEvent(leadId, sessionId, 'token_created', {
      contract_address: deploymentData.address,
      network: deploymentData.network,
      tx_hash: deploymentData.txHash
    });
  };
  
  return {
    sessionId,
    leadId,
    trackFormStart,
    trackWalletConnect,
    trackCtaClick,
    trackFormProgress,
    trackAbandonment,
    trackConversion
  };
};
