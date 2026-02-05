/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  USE DEPLOYMENT HISTORY HOOK                             ║
 * ║  Manages deployment history state & fetching              ║
 * ╚═══════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchDeploymentHistory } from '../services/deploymentService';

export const useDeploymentHistory = () => {
  const [deploys, setDeploys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  /**
   * Fetch deployment history
   */
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchDeploymentHistory();
      setDeploys(data);
    } catch (err) {
      setError(err.message);
      console.error('[DEPLOYMENT HISTORY] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Fetch on mount
   */
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
  
  /**
   * Refresh history (can be called externally)
   */
  const refresh = useCallback(() => {
    fetchHistory();
  }, [fetchHistory]);
  
  return {
    deploys,
    loading,
    error,
    refresh
  };
};
