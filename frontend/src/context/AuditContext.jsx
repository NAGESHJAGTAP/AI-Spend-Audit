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

  // Compute shareId (or null) from current path.
  const parseShareIdFromPath = useCallback((path) => {
    const m = path.match(/^\/(?:share|audit)\/([a-zA-Z0-9_-]+)(?:\/)?$/);
    return m ? m[1] : null;
  }, []);

  const handleRouting = useCallback(() => {
    const path = window.location.pathname;
    const shareId = parseShareIdFromPath(path);

    if (shareId) {
      setIsSharedView(true);
      setStep('results');
      return;
    }

    if (path === '/result') {
      if (!auditResult) {
        setStep('form');
        window.history.replaceState({}, '', '/');
      } else {
        setIsSharedView(false);
        setStep('results');
      }
      return;
    }

    if (path.startsWith('/share/')) {
      // URL variant but not matching our shareId regex; stop spinner.
      setIsSharedView(true);
      setIsLoadingShared(false);
      setShareError('Audit not found.');
      setStep('form');
      return;
    }

    setIsSharedView(false);
    setIsLoadingShared(false);
    setStep('form');
  }, [auditResult, parseShareIdFromPath]);

  // Fetch shared audit ONCE per shareId.
  // IMPORTANT: dependency array must be ONLY [shareId].
  const shareId = parseShareIdFromPath(window.location.pathname);

  useEffect(() => {
    console.log('[AuditContext] Effect fired; shareId:', shareId);
    if (!shareId) return;

    let cancelled = false;
    (async () => {
      setIsLoadingShared(true);
      setShareError(null);
      try {
        console.log('[AuditContext] fetching audit for shareId', shareId);
        const result = await getAuditByShareId(shareId);
        if (cancelled) return;
        if (!result) {
          setAuditResult(null);
          setShareError('Audit Not Found');
          setIsSharedView(false);
          setStep('form');
          return;
        }
        setAuditResult(result);
        setIsSharedView(true);
        setStep('results');
      } catch (err) {
        if (cancelled) return;
        console.error('[AuditContext] failed fetch shared audit', err);
        setAuditResult(null);
        setShareError('Audit Not Found');
        setIsSharedView(false);
        setStep('form');
        window.history.replaceState({}, '', '/');
      } finally {
        if (cancelled) return;
        console.log('[AuditContext] done loading shared audit; setting isLoadingShared=false');
        setIsLoadingShared(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [shareId]);

  // Handle popstate (back/forward browser buttons)
  useEffect(() => {
    handleRouting();
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, [handleRouting]);

  // Safety: if we are not on a shared route, never leave the shared loader stuck.
  useEffect(() => {
    const path = window.location.pathname;
    const isSharedRoute = /^(\/share\/[^/]+\/?|\/audit\/[^/]+\/?)/.test(path);
    if (!isSharedRoute) setIsLoadingShared(false);
  }, []);


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

