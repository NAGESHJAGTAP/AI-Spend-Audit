// src/utils/validators.js
// Form validation helpers

/**
 * Validate a single tool spend entry
 * @param {Object} entry - { tool, seats, tier, monthlySpend }
 * @returns {Object} - { valid: boolean, errors: Object }
 */
export function validateSpendEntry(entry) {
  const errors = {};
  if (!entry.tool) errors.tool = 'Please select a tool';
  if (!entry.seats || entry.seats < 1) errors.seats = 'At least 1 seat required';
  if (!entry.tier) errors.tier = 'Please select a pricing tier';
  if (entry.monthlySpend !== undefined && entry.monthlySpend < 0)
    errors.monthlySpend = 'Spend cannot be negative';
  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validate the lead capture form
 * @param {Object} lead - { name, email, company }
 */
export function validateLead(lead) {
  const errors = {};
  if (!lead.name || lead.name.trim().length < 2) errors.name = 'Name is required';
  if (!lead.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email))
    errors.email = 'Valid email required';
  // Company is optional
  return { valid: Object.keys(errors).length === 0, errors };
}
