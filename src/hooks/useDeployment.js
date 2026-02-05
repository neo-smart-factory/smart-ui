/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  USE DEPLOYMENT HOOK                                     ║
 * ║  Orchestrates token deployment flow                       ║
 * ╚═══════════════════════════════════════════════════════════╝
 */

import { useState, useCallback } from 'react';
import { deployToken, recordDeployment } from '../services/deploymentService';
import { TRANSACTION_STATUS } from '../types/cli';

export const useDeployment = (
  formData,
  userAddress,
  options = {}
) => {
  const {
    isRealTransactionsEnabled = false,
    signer = null,
    onSuccess = () => {},
    onError = () => {}
  } = options;
  
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [transaction, setTransaction] = useState(null);
  
  /**
   * Execute deployment
   */
  const deploy = useCallback(async (metadata = {}) => {
    setLoading(true);
    setProgress(10);
    setStatus('Validating Protocol Sequence...');
    setError(null);
    
    // Set transaction as pending
    if (isRealTransactionsEnabled) {
      setTransaction({
        status: TRANSACTION_STATUS.PENDING,
        txHash: null,
        network: formData.network
      });
    }
    
    try {
      // Deploy token
      const deploymentResult = await deployToken(formData, userAddress, {
        isRealTransactions: isRealTransactionsEnabled,
        signer,
        onProgress: setProgress,
        onStatus: setStatus
      });
      
      // Update transaction as confirmed
      if (isRealTransactionsEnabled) {
        setTransaction({
          status: TRANSACTION_STATUS.CONFIRMED,
          txHash: deploymentResult.txHash,
          contractAddress: deploymentResult.address,
          network: formData.network
        });
      }
      
      // Record in database
      await recordDeployment(deploymentResult, userAddress, metadata);
      
      setResult(deploymentResult);
      onSuccess(deploymentResult);
      
    } catch (err) {
      const errorMessage = err.message || 'Protocol Deployment Failed: Connectivity issues.';
      
      // Update transaction as failed
      if (isRealTransactionsEnabled) {
        setTransaction({
          status: TRANSACTION_STATUS.FAILED,
          error: errorMessage,
          network: formData.network
        });
      }
      
      setError(errorMessage);
      onError(err);
      
    } finally {
      setLoading(false);
    }
  }, [formData, userAddress, isRealTransactionsEnabled, signer, onSuccess, onError]);
  
  /**
   * Reset deployment state
   */
  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setProgress(0);
    setStatus('');
    setTransaction(null);
  }, []);
  
  /**
   * Clear transaction status
   */
  const clearTransaction = useCallback(() => {
    setTransaction(null);
  }, []);
  
  return {
    deploy,
    reset,
    clearTransaction,
    loading,
    progress,
    status,
    result,
    error,
    transaction
  };
};
