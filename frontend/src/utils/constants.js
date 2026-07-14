// src/utils/constants.js
// App-wide constants

export const TOOLS = [
  { value: 'chatgpt', label: 'ChatGPT (OpenAI)' },
  { value: 'claude', label: 'Claude (Anthropic)' },
  { value: 'gemini', label: 'Gemini (Google)' },
  { value: 'copilot', label: 'GitHub Copilot' },
  { value: 'midjourney', label: 'Midjourney' },
  { value: 'notion_ai', label: 'Notion AI' },
  { value: 'grammarly', label: 'Grammarly' },
  { value: 'jasper', label: 'Jasper AI' },
  { value: 'perplexity', label: 'Perplexity AI' },
  { value: 'runway', label: 'Runway ML' },
];

export const TIERS = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro / Individual' },
  { value: 'team', label: 'Team' },
  { value: 'enterprise', label: 'Enterprise' },
];

export const DEFAULT_TOOL_ENTRY = {
  tool: '',
  seats: 1,
  tier: '',
  monthlySpend: '',
};

export const LS_FORM_KEY = 'ai_spend_audit_form';
