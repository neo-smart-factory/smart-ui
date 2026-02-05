/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  MARKETING SERVICE - NEØ SMART FACTORY                   ║
 * ║  Analytics & conversion tracking                          ║
 * ╚═══════════════════════════════════════════════════════════╝
 */

import { safeApiCall, sendBeacon } from './apiService';

/**
 * Generate or retrieve session ID
 */
export const getOrCreateSessionId = () => {
  if (typeof window === 'undefined') return null;
  
  let sessionId = localStorage.getItem('neosmart_session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('neosmart_session_id', sessionId);
  }
  
  return sessionId;
};

/**
 * Extract UTM parameters from URL
 */
const extractUtmParams = () => {
  const params = new URLSearchParams(window.location.search);
  
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign')
  };
};

/**
 * Create lead on first visit
 */
export const createLead = async (sessionId) => {
  const utm = extractUtmParams();
  
  return await safeApiCall('/api/marketing?action=lead-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
      ...utm,
      conversion_status: 'visitor'
    })
  });
};

/**
 * Update lead status
 */
export const updateLeadStatus = async (sessionId, status, additionalData = {}) => {
  return await safeApiCall('/api/marketing?action=lead-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      conversion_status: status,
      ...additionalData
    })
  });
};

/**
 * Record analytics event
 */
export const recordEvent = async (leadId, sessionId, eventType, eventData = {}) => {
  return await safeApiCall('/api/marketing?action=event-record', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lead_id: leadId,
      session_id: sessionId,
      event_type: eventType,
      event_data: eventData
    })
  });
};

/**
 * Update session progress
 */
export const updateSession = async (leadId, sessionId, stepReached, formSnapshot = null) => {
  return await safeApiCall('/api/marketing?action=session-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lead_id: leadId,
      session_id: sessionId,
      step_reached: stepReached,
      form_data_snapshot: formSnapshot
    })
  });
};

/**
 * Calculate conversion funnel step from form data
 */
export const calculateFunnelStep = (formData) => {
  if (formData.description) return 4;
  if (formData.tokenSupply) return 3;
  if (formData.tokenSymbol) return 2;
  if (formData.tokenName) return 1;
  return 0;
};

/**
 * Record form abandonment (use beacon for reliability)
 */
export const recordAbandonment = (sessionId, leadId, stepReached) => {
  // Session sync
  sendBeacon('/api/marketing', {
    action: 'session-sync',
    session_id: sessionId,
    abandoned_at: new Date().toISOString(),
    step_reached: stepReached
  });
  
  // Abandonment event
  sendBeacon('/api/marketing', {
    action: 'event-record',
    lead_id: leadId,
    session_id: sessionId,
    event_type: 'form_abandon',
    event_data: { step_reached: stepReached }
  });
};

/**
 * Complete conversion tracking
 */
export const recordConversion = async (sessionId, leadId, deploymentData) => {
  // Update lead to converted
  await updateLeadStatus(sessionId, 'token_created');
  
  // Mark session as completed
  await updateSession(leadId, sessionId, 4);
  
  // Record conversion event
  await recordEvent(leadId, sessionId, 'token_created', {
    contract_address: deploymentData.address,
    network: deploymentData.network,
    tx_hash: deploymentData.txHash
  });
};
