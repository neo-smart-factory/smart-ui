/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  USE CLOUD SYNC HOOK                                     ║
 * ║  Auto-save & load deployment drafts                       ║
 * ╚═══════════════════════════════════════════════════════════╝
 */

import { useEffect, useRef } from 'react';
import { saveDraft, loadDraft } from '../services/deploymentService';

const AUTOSAVE_DEBOUNCE = 2000; // 2s

export const useCloudSync = (formData, userAddress, enabled, metadata = {}) => {
  const saveTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  
  /**
   * Auto-save draft (debounced)
   */
  useEffect(() => {
    if (!enabled || !userAddress) return;
    
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce save
    saveTimeoutRef.current = setTimeout(async () => {
      await saveDraft(userAddress, formData, metadata);
    }, AUTOSAVE_DEBOUNCE);
    
    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, userAddress, enabled, metadata]);
  
  /**
   * Load draft on mount
   */
  useEffect(() => {
    if (!userAddress) return;
    
    abortControllerRef.current = new AbortController();
    
    const fetchDraft = async () => {
      const draftData = await loadDraft(userAddress, abortControllerRef.current.signal);
      
      if (draftData && typeof draftData === 'object') {
        return draftData;
      }
      
      return null;
    };
    
    fetchDraft();
    
    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [userAddress]);
  
  return null; // Hook handles side effects only
};
