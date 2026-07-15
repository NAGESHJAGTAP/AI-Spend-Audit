// backend/config/pricing.js
// All pricing data — verified against official vendor pages July 2025
// Sources documented in PRICING_DATA.md

export const PRICING = {
  cursor: {
    hobby: 0,       // free tier
    pro: 20,        // $20/user/mo — cursor.com/pricing
    business: 40,   // $40/user/mo — cursor.com/pricing
    enterprise: 100 // custom; $100 estimate per seat
  },
  copilot: {
    individual: 10,   // $10/mo — github.com/features/copilot
    business: 19,     // $19/user/mo
    enterprise: 39    // $39/user/mo
  },
  claude: {
    free: 0,
    pro: 20,          // $20/mo — anthropic.com/claude/plans
    max5: 100,        // $100/mo (5x usage)
    max20: 200,       // $200/mo (20x usage)
    team: 30,         // $30/user/mo, 5-seat min
    enterprise: 75    // estimated per seat
  },
  chatgpt: {
    plus: 20,         // $20/mo — openai.com/chatgpt/pricing
    team: 30,         // $30/user/mo, 2-seat min
    enterprise: 60,   // estimated
    pro: 200          // $200/mo OpenAI Pro plan
  },
  gemini: {
    free: 0,
    pro: 20,   // Google One AI Premium — one.google.com
    ultra: 24, // legacy name; now same as AI Premium
  },
  windsurf: {
    free: 0,
    pro: 15,   // $15/mo — codeium.com/windsurf/pricing
    team: 30,  // $30/user/mo
    enterprise: 60
  },
  // API tiers — stored as rate-per-million-tokens for reference only
  // actual audit uses monthlySpend directly from user input
  anthropicApi: {
    haiku:  { inputPerMillion: 0.80,  outputPerMillion: 4.00  },
    sonnet: { inputPerMillion: 3.00,  outputPerMillion: 15.00 },
    opus:   { inputPerMillion: 15.00, outputPerMillion: 75.00 }
  },
  openaiApi: {
    gpt4oMini: { inputPerMillion: 0.15, outputPerMillion: 0.60  },
    gpt4o:     { inputPerMillion: 2.50, outputPerMillion: 10.00 },
    o1:        { inputPerMillion: 15.00, outputPerMillion: 60.00 }
  },
  geminiApi: {
    flash:  { inputPerMillion: 0.075, outputPerMillion: 0.30 },
    pro:    { inputPerMillion: 1.25,  outputPerMillion: 5.00 }
  }
};
