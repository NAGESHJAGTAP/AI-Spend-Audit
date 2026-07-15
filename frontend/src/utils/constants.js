// src/utils/constants.js
// All required tools per TechVruk assignment spec

export const TOOLS = [
  // ── Coding assistants ─────────────────────────────────────────────────────
  { value: 'cursor',    label: 'Cursor',           category: 'coding' },
  { value: 'copilot',   label: 'GitHub Copilot',   category: 'coding' },
  { value: 'windsurf',  label: 'Windsurf (Codeium)', category: 'coding' },

  // ── General AI assistants ─────────────────────────────────────────────────
  { value: 'claude',    label: 'Claude (Anthropic)', category: 'assistant' },
  { value: 'chatgpt',   label: 'ChatGPT (OpenAI)',   category: 'assistant' },
  { value: 'gemini',    label: 'Gemini (Google)',     category: 'assistant' },

  // ── API direct ────────────────────────────────────────────────────────────
  { value: 'anthropicApi', label: 'Anthropic API (direct)', category: 'api' },
  { value: 'openaiApi',    label: 'OpenAI API (direct)',    category: 'api' },
  { value: 'geminiApi',    label: 'Gemini API (direct)',    category: 'api' },
];

export const TIERS = {
  cursor: [
    { value: 'hobby',      label: 'Hobby (Free)' },
    { value: 'pro',        label: 'Pro – $20/mo' },
    { value: 'business',   label: 'Business – $40/seat/mo' },
    { value: 'enterprise', label: 'Enterprise' },
  ],
  copilot: [
    { value: 'individual', label: 'Individual – $10/mo' },
    { value: 'business',   label: 'Business – $19/seat/mo' },
    { value: 'enterprise', label: 'Enterprise – $39/seat/mo' },
  ],
  claude: [
    { value: 'free',       label: 'Free' },
    { value: 'pro',        label: 'Pro – $20/mo' },
    { value: 'max5',       label: 'Max (5×) – $100/mo' },
    { value: 'max20',      label: 'Max (20×) – $200/mo' },
    { value: 'team',       label: 'Team – $30/seat/mo (5 min)' },
    { value: 'enterprise', label: 'Enterprise' },
  ],
  chatgpt: [
    { value: 'plus',       label: 'Plus – $20/mo' },
    { value: 'pro',        label: 'Pro – $200/mo' },
    { value: 'team',       label: 'Team – $30/seat/mo (2 min)' },
    { value: 'enterprise', label: 'Enterprise' },
  ],
  gemini: [
    { value: 'free',  label: 'Free' },
    { value: 'pro',   label: 'AI Premium – $20/mo' },
    { value: 'ultra', label: 'Ultra – $24/mo' },
  ],
  windsurf: [
    { value: 'free',       label: 'Free' },
    { value: 'pro',        label: 'Pro – $15/mo' },
    { value: 'team',       label: 'Team – $30/seat/mo' },
    { value: 'enterprise', label: 'Enterprise' },
  ],
  anthropicApi: [
    { value: 'haiku',  label: 'Haiku' },
    { value: 'sonnet', label: 'Sonnet' },
    { value: 'opus',   label: 'Opus' },
  ],
  openaiApi: [
    { value: 'gpt4oMini', label: 'GPT-4o-mini' },
    { value: 'gpt4o',     label: 'GPT-4o' },
    { value: 'o1',        label: 'o1' },
  ],
  geminiApi: [
    { value: 'flash', label: 'Gemini Flash' },
    { value: 'pro',   label: 'Gemini Pro' },
  ],
};

export const DEFAULT_TIERS = {
  cursor: 'pro', copilot: 'individual', claude: 'pro',
  chatgpt: 'plus', gemini: 'pro', windsurf: 'pro',
  anthropicApi: 'sonnet', openaiApi: 'gpt4o', geminiApi: 'pro',
};

export const USE_CASES = [
  { value: 'coding',   label: '💻 Coding / Engineering' },
  { value: 'writing',  label: '✍️ Writing / Content' },
  { value: 'data',     label: '📊 Data / Analysis' },
  { value: 'research', label: '🔍 Research' },
  { value: 'mixed',    label: '🔀 Mixed / General' },
];

export const DEFAULT_TOOL_ENTRY = {
  name: '',
  plan: '',
  seats: 1,
  monthlySpend: '',
};

export const LS_FORM_KEY = 'ai_spend_audit_v2_form';
export const LS_TEAM_KEY = 'ai_spend_audit_v2_team';
