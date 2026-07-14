// src/context/AuditContext.jsx
// Global state context for audit data — avoids prop drilling

import { createContext, useContext, useState, useCallback } from 'react';

const AuditContext = createContext(null);

export function AuditProvider({ children }) {
  const [auditResult, setAuditResult] = useState(null);
  const [spendData, setSpendData] = useState(null);
  const [step, setStep] = useState('form'); // 'form' | 'results' | 'lead'

  const goToResults = useCallback((result, spend) => {
    setAuditResult(result);
    setSpendData(spend);
    setStep('results');
  }, []);

  const goToLead = useCallback(() => setStep('lead'), []);
  const goToForm = useCallback(() => {
    setStep('form');
    setAuditResult(null);
    setSpendData(null);
  }, []);

  return (
    <AuditContext.Provider
      value={{ auditResult, spendData, step, goToResults, goToLead, goToForm }}
    >
      {children}
    </AuditContext.Provider>
  );
}

export function useAuditContext() {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error('useAuditContext must be used within AuditProvider');
  return ctx;
}
