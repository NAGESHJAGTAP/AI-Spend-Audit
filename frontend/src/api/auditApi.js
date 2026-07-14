// src/api/auditApi.js
// All API calls to the Express backend live here

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Submit spend data to get an audit result
 * @param {Object} spendData - tool spend payload
 * @returns {Promise<Object>} - audit result with savings
 */
export async function submitAudit(spendData) {
  const res = await fetch(`${BASE_URL}/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spendData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Audit request failed');
  }
  return res.json();
}

/**
 * Fetch a previously saved audit by its public share ID
 * @param {string} shareId
 * @returns {Promise<Object>} - saved audit result
 */
export async function getAuditByShareId(shareId) {
  const res = await fetch(`${BASE_URL}/audit/share/${shareId}`);
  if (!res.ok) throw new Error('Could not load shared audit');
  return res.json();
}

/**
 * Submit lead capture form (name, email, company)
 * @param {Object} leadData
 * @returns {Promise<Object>}
 */
export async function submitLead(leadData) {
  const res = await fetch(`${BASE_URL}/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lead capture failed');
  }
  return res.json();
}
