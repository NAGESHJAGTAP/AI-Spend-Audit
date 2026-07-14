export const PRICING = {
  cursor: {
    hobby: 0,
    pro: 20,
    business: 40,
    enterprise: 100,
  },
  copilot: {
    individual: 10,
    business: 19,
    enterprise: 39,
  },
  claude: {
    free: 0,
    pro: 20,
    max: 40,
    team: 30,
    enterprise: 75,
  },
  chatgpt: {
    plus: 20,
    team: 30,
    enterprise: 60,
  },
  gemini: {
    pro: 20,
    ultra: 24,
  },
  windsurf: {
    free: 0,
    pro: 15,
    team: 30,
  },
  anthropicApi: {
    sonnet: { inputPerMillion: 3.00, outputPerMillion: 15.00 },
    haiku: { inputPerMillion: 0.80, outputPerMillion: 4.00 },
    opus: { inputPerMillion: 15.00, outputPerMillion: 75.00 },
  },
  openaiApi: {
    gpt4o: { inputPerMillion: 2.50, outputPerMillion: 10.00 },
    gpt4oMini: { inputPerMillion: 0.15, outputPerMillion: 0.60 },
    o1Pro: { inputPerMillion: 15.00, outputPerMillion: 60.00 },
  },
  geminiApi: {
    pro: { inputPerMillion: 1.25, outputPerMillion: 5.00 },
    flash: { inputPerMillion: 0.075, outputPerMillion: 0.30 },
  }
};
