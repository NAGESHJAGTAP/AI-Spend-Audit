// src/utils/formatCurrency.js
// Shared currency / number formatting utilities

/**
 * Format a number as USD currency
 * @param {number} value
 * @param {number} decimals
 */
export function formatUSD(value, decimals = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a number with compact notation (e.g., 1.2K, 3.5M)
 */
export function formatCompact(value) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format savings percentage
 * @param {number} current
 * @param {number} optimized
 */
export function savingsPercent(current, optimized) {
  if (!current || current === 0) return 0;
  return Math.round(((current - optimized) / current) * 100);
}
