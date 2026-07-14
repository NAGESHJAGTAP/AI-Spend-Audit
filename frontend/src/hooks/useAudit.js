// src/hooks/useAudit.js
// Custom hook that manages audit submission state

import { useState, useCallback } from 'react';
import { submitAudit } from '../api/auditApi';

export function useAudit() {
  const [auditResult, setAuditResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAudit = useCallback(async (spendData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await submitAudit(spendData);
      setAuditResult(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetAudit = useCallback(() => {
    setAuditResult(null);
    setError(null);
  }, []);

  return { auditResult, loading, error, runAudit, resetAudit };
}
