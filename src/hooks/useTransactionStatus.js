import { useState } from "react";

/**
 * Hook to manage transaction status
 *
 * @returns {Object} - { transaction, setTransaction, clearTransaction }
 */
export function useTransactionStatus() {
  const [transaction, setTransaction] = useState(null);

  const clearTransaction = () => {
    setTransaction(null);
  };

  return {
    transaction,
    setTransaction,
    clearTransaction,
  };
}
