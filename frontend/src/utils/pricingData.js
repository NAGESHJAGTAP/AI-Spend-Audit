// src/utils/pricingData.js
// Frontend pricing reference — mirrors backend/config/pricing.js
// Used for display labels, plan validation, and cost estimates in the UI
// Sources: verified against official vendor pages July 2025 (see PRICING_DATA.md)

export const pricing = {
  cursor: {
    hobby:      0,    // free tier
    pro:        20,   // $20/user/mo
    business:   40,   // $40/user/mo
    enterprise: 100,  // estimated
  },
  copilot: {
    individual: 10,  // $10/mo
    business:   19,  // $19/user/mo
    enterprise: 39,  // $39/user/mo
  },
  claude: {
    free:       0,
    pro:        20,  // $20/mo
    max5:       100, // $100/mo (5× usage)
    max20:      200, // $200/mo (20× usage)
    team:       30,  // $30/user/mo, 5-seat min
    enterprise: 75,  // estimated per seat
  },
  chatgpt: {
    plus:       20,  // $20/mo
    team:       30,  // $30/user/mo, 2-seat min
    enterprise: 60,  // estimated
    pro:        200, // $200/mo OpenAI Pro
  },
  gemini: {
    free:  0,
    pro:   20, // Google One AI Premium
    ultra: 24, // legacy name
  },
  windsurf: {
    free:       0,
    pro:        15,  // $15/mo
    team:       30,  // $30/user/mo
    enterprise: 60,
  },
  // API pricing — cost per million tokens (for display/reference only)
  anthropicApi: {
    haiku:  { inputPerMillion: 0.80,  outputPerMillion: 4.00  },
    sonnet: { inputPerMillion: 3.00,  outputPerMillion: 15.00 },
    opus:   { inputPerMillion: 15.00, outputPerMillion: 75.00 },
  },
  openaiApi: {
    gpt4oMini: { inputPerMillion: 0.15, outputPerMillion: 0.60  },
    gpt4o:     { inputPerMillion: 2.50, outputPerMillion: 10.00 },
    o1:        { inputPerMillion: 15.00, outputPerMillion: 60.00 },
  },
  geminiApi: {
    flash: { inputPerMillion: 0.075, outputPerMillion: 0.30 },
    pro:   { inputPerMillion: 1.25,  outputPerMillion: 5.00 },
  },
};

/**
 * Get the monthly rate for a specific tool/plan combination.
 * Returns undefined for API-based tools (no flat rate).
 * @param {string} tool  - tool key e.g. 'cursor'
 * @param {string} plan  - plan key e.g. 'pro'
 * @param {number} seats - number of seats/licenses
 * @returns {number|undefined}
 */
export function getMonthlyRate(tool, plan, seats = 1) {
  const toolPricing = pricing[tool];
  if (!toolPricing) return undefined;
  const rate = toolPricing[plan];
  if (typeof rate !== 'number') return undefined;
  return rate * seats;
}

/**
 * Check if a tool/plan is an API consumption tier (not a flat subscription).
 * @param {string} tool
 * @param {string} plan
 * @returns {boolean}
 */
export function isApiTier(tool, plan) {
  const toolPricing = pricing[tool];
  if (!toolPricing) return false;
  const val = toolPricing[plan];
  return val !== null && typeof val === 'object' && 'inputPerMillion' in val;
}
