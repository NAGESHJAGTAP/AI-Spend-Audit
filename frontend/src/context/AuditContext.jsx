// src/context/AuditContext.jsx
// Global state context for audit data — avoids prop drilling and implements routing

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getAuditByShareId } from '../api/auditApi';

const AuditContext = createContext(null);

export function AuditProvider({ children }) {
  const [auditResult, setAuditResult] = useState(null);
  const [spendData, setSpendData] = useState(null);
  const [step, setStep] = useState('form'); // 'form' | 'results' | 'lead'
  const [isSharedView, setIsSharedView] = useState(false);
  const [isLoadingShared, setIsLoadingShared] = useState(false);
  const [shareError, setShareError] = useState(null);

  const handleRouting = useCallback(async () => {
    const path = window.location.pathname;
    const shareMatch = path.match(/^\/(?:share|audit)\/([a-zA-Z0-9_-]+)$/);

    if (shareMatch) {
      const shareId = shareMatch[1];
      setIsLoadingShared(true);
      setShareError(null);
      try {
        const result = await getAuditByShareId(shareId);
        setAuditResult(result);
        setIsSharedView(true);
        setStep('results');
      } catch (err) {
        console.error('[Routing] Failed to fetch shared audit:', err);
        setShareError('Shared audit report not found.');
        setStep('form');
        window.history.replaceState({}, '', '/');
      } finally {
        setIsLoadingShared(false);
      }
    } else if (path === '/result') {
      if (!auditResult) {
        // Redirect to form if no result in state
        setStep('form');
        window.history.replaceState({}, '', '/');
      } else {
        setIsSharedView(false);
        setStep('results');
      }
    } else {
      setStep('form');
    }
  }, [auditResult]);

  // Handle popstate (back/forward browser buttons)
  useEffect(() => {
    handleRouting();
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, [handleRouting]);

  const goToResults = useCallback((result, spend) => {
    setAuditResult(result);
    setSpendData(spend);
    setIsSharedView(false);
    setStep('results');
    window.history.pushState({}, '', '/result');
  }, []);

  const goToLead = useCallback(() => {
    setStep('lead');
  }, []);

  const goToForm = useCallback(() => {
    setStep('form');
    setAuditResult(null);
    setSpendData(null);
    setIsSharedView(false);
    setShareError(null);
    window.history.pushState({}, '', '/');
  }, []);

  return (
    <AuditContext.Provider
      value={{
        auditResult,
        spendData,
        step,
        isSharedView,
        isLoadingShared,
        shareError,
        goToResults,
        goToLead,
        goToForm,
      }}
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

