// src/hooks/useLead.js
// Custom hook for lead capture submission

import { useState, useCallback } from 'react';
import { submitLead } from '../api/auditApi';

export function useLead() {
  const [leadStatus, setLeadStatus] = useState('idle'); // idle | loading | success | error
  const [leadError, setLeadError] = useState(null);

  const captureLead = useCallback(async (leadData) => {
    setLeadStatus('loading');
    setLeadError(null);
    try {
      await submitLead(leadData);
      setLeadStatus('success');
    } catch (err) {
      setLeadError(err.message);
      setLeadStatus('error');
    }
  }, []);

  const resetLead = useCallback(() => {
    setLeadStatus('idle');
    setLeadError(null);
  }, []);

  return { leadStatus, leadError, captureLead, resetLead };
}
