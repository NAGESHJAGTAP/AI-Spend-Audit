// backend/lib/auditEngine.js
// Deterministic audit logic — all rules are hardcoded, no AI used here.
// AI is intentionally excluded from math to keep results defensible.

import { PRICING } from '../config/pricing.js';

// ─── Alternative tool recommendations ───────────────────────────────────────
const ALTERNATIVES = {
  copilot: { tool: 'cursor', plan: 'hobby', monthlyRate: 0,  note: 'Cursor Hobby is free and includes GPT-4o / Claude integration' },
  chatgpt:  { tool: 'claude', plan: 'pro',  monthlyRate: 20, note: 'Claude Pro is same price but generally stronger for writing/research' },
  gemini:   { tool: 'claude', plan: 'pro',  monthlyRate: 20, note: 'Claude Pro offers superior reasoning for most use cases at same price' },
};

// ─── Main audit function ─────────────────────────────────────────────────────
export function runAudit(input) {
  const { teamSize = 1, primaryUseCase = 'mixed', tools = [] } = input;

  const toolBreakdown = [];
  let originalTotalSpend   = 0;
  let recommendedTotalSpend = 0;

  // Flag which tools are present — used for redundancy detection
  const toolNames = new Set(tools.map(t => t.name));
  const hasCursor    = toolNames.has('cursor');
  const hasClaude    = toolNames.has('claude');
  const hasOpenaiApi = toolNames.has('openaiApi');

  for (const tool of tools) {
    const { name, plan, seats = 1, monthlySpend: rawSpend = 0 } = tool;
    let monthlySpend = Number(rawSpend || 0);

    // Auto-calculate subscription tools if spend is omitted/zero
    if (!monthlySpend || monthlySpend === 0) {
      const rates = PRICING[name];
      if (rates && typeof rates === 'object') {
        const rate = rates[plan];
        if (typeof rate === 'number') {
          monthlySpend = rate * seats;
        }
      }
    }

    originalTotalSpend += monthlySpend;

    let recommendedPlan  = plan;
    let recommendedSpend = monthlySpend;
    let reason = 'Spend looks well-optimised for your current plan and team size.';
    let alternativeTool  = null;
    let creditsNote      = null;
    let action           = 'keep'; // keep | downgrade | cancel | switch | optimize-api

    // ── RULE 1: GitHub Copilot + Cursor = redundant ───────────────────────
    if (name === 'copilot' && hasCursor) {
      recommendedPlan  = 'cancel';
      recommendedSpend = 0;
      action           = 'cancel';
      reason = 'Redundant with Cursor. Cursor includes its own LLM-powered autocomplete and chat (GPT-4o, Claude). Canceling Copilot saves 100% of this spend immediately.';
    }

    // ── RULE 2: ChatGPT Plus + Claude = redundant for writing/mixed ───────
    else if (name === 'chatgpt' && (plan === 'plus' || plan === 'pro') && hasClaude && ['writing', 'mixed', 'research'].includes(primaryUseCase)) {
      recommendedPlan  = 'cancel';
      recommendedSpend = 0;
      action           = 'cancel';
      reason = `Redundant general-purpose assistant. Your team already pays for Claude, which outperforms ChatGPT on ${primaryUseCase} tasks (Anthropic SF-bench, Jul 2025). Consolidating saves $${monthlySpend}/mo.`;
    }

    // ── RULE 3: Claude Team < 5 seats — minimum seat violation ───────────
    else if (name === 'claude' && plan === 'team') {
      const minSeats   = 5;
      const ratePerSeat = PRICING.claude.team;
      if (seats < minSeats) {
        recommendedPlan  = 'pro';
        recommendedSpend = seats * PRICING.claude.pro;
        action           = 'downgrade';
        reason = `Claude Team enforces a 5-seat minimum ($150/mo). With ${seats} seats, Claude Pro ($20/seat/mo) drops your spend to $${recommendedSpend}/mo — a saving of $${monthlySpend - recommendedSpend}/mo.`;
      } else {
        recommendedSpend = seats * ratePerSeat;
      }
    }

    // ── RULE 4: ChatGPT Team < 2 seats — minimum seat violation ──────────
    else if (name === 'chatgpt' && plan === 'team') {
      const minSeats    = 2;
      const ratePerSeat = PRICING.chatgpt.team;
      if (seats < minSeats) {
        recommendedPlan  = 'plus';
        recommendedSpend = seats * PRICING.chatgpt.plus;
        action           = 'downgrade';
        reason = `ChatGPT Team enforces a 2-seat minimum ($60/mo). With ${seats} seat(s), ChatGPT Plus ($20/mo) saves you $${monthlySpend - recommendedSpend}/mo with identical access for individual use.`;
      } else {
        recommendedSpend = seats * ratePerSeat;
      }
    }

    // ── RULE 5: Solo on Cursor Business → downgrade to Pro ───────────────
    else if (name === 'cursor' && plan === 'business' && teamSize <= 1) {
      recommendedPlan  = 'pro';
      recommendedSpend = PRICING.cursor.pro;
      action           = 'downgrade';
      reason = 'Solo developer on Cursor Business ($40/mo). Cursor Pro ($20/mo) gives identical AI coding capabilities — the only Business-only feature is admin controls, unused by solos.';
    }

    // ── RULE 6: Solo on Copilot Business → downgrade to Individual ───────
    else if (name === 'copilot' && plan === 'business' && teamSize <= 1) {
      recommendedPlan  = 'individual';
      recommendedSpend = PRICING.copilot.individual;
      action           = 'downgrade';
      reason = 'Solo developer on Copilot Business ($19/mo). Copilot Individual ($10/mo) gives identical code completion — Business adds only policy management you don\'t need alone.';
    }

    // ── RULE 7: Windsurf Team for solo → downgrade to Pro ────────────────
    else if (name === 'windsurf' && plan === 'team' && teamSize <= 1) {
      recommendedPlan  = 'pro';
      recommendedSpend = PRICING.windsurf.pro;
      action           = 'downgrade';
      reason = 'Solo developer on Windsurf Team ($30/mo). Windsurf Pro ($15/mo) provides the same AI completions — Team tier only adds centralized billing and admin seats.';
    }

    // ── RULE 8: OpenAI API — model-mix optimization ───────────────────────
    else if (name === 'openaiApi' && monthlySpend > 50) {
      const savedFraction = hasOpenaiApi ? 0.40 : 0.35;
      const saving = Math.round(monthlySpend * savedFraction);
      recommendedSpend = monthlySpend - saving;
      action           = 'optimize-api';
      reason = `High OpenAI API spend detected. Routing ~50% of simple tasks (classification, summarization, formatting) from GPT-4o ($2.50/M input) to GPT-4o-mini ($0.15/M input) typically cuts API bills by 35–40%. Estimated saving: $${saving}/mo.`;
    }

    // ── RULE 9: Anthropic API — model-mix optimization ───────────────────
    else if (name === 'anthropicApi' && monthlySpend > 50) {
      const saving = Math.round(monthlySpend * 0.35);
      recommendedSpend = monthlySpend - saving;
      action           = 'optimize-api';
      reason = `High Anthropic API spend detected. Routing low-complexity prompts (summarization, Q&A, structured output) to Claude 3.5 Haiku ($0.80/M input vs Sonnet's $3.00/M) saves ~35% without quality loss. Estimated saving: $${saving}/mo.`;
    }

    // ── RULE 10: Gemini API — model mix optimization ──────────────────────
    else if (name === 'geminiApi' && monthlySpend > 30) {
      const saving = Math.round(monthlySpend * 0.45);
      recommendedSpend = monthlySpend - saving;
      action           = 'optimize-api';
      reason = `High Gemini API spend. Gemini Flash ($0.075/M input) is 16x cheaper than Gemini Pro ($1.25/M). Shifting lightweight workloads to Flash typically saves 40–45%. Estimated saving: $${saving}/mo.`;
    }

    // ── RULE 11: Standard seat count alignment ────────────────────────────
    else {
      const rates = PRICING[name];
      if (rates && typeof rates === 'object') {
        const firstVal = Object.values(rates)[0];
        const isApi = firstVal && typeof firstVal === 'object' && 'inputPerMillion' in firstVal;
        if (!isApi) {
          const rate = rates[plan];
          if (rate !== undefined && rate > 0) {
            const expected = rate * seats;
            if (monthlySpend > expected + 1) {
              recommendedSpend = expected;
              action = 'correct-billing';
              reason = `Your reported spend ($${monthlySpend}/mo) exceeds the standard retail rate of $${rate}/seat × ${seats} seats = $${expected}/mo. Verify your invoice for billing errors.`;
            }
          }
        }
      }
    }

    // ── Startup API credits check ─────────────────────────────────────────
    if (['openaiApi', 'anthropicApi', 'geminiApi'].includes(name) && monthlySpend >= 100 && teamSize < 20) {
      creditsNote = 'As an early-stage team you likely qualify for $25k–$100k in free API credits via AWS Activate, Microsoft for Startups, or Google for Startups Cloud Program. This could cover 100% of your API spend.';
    }

    // ── Alternative tool suggestion (only when not already cancelled) ─────
    if (action === 'keep' && ALTERNATIVES[name]) {
      const alt = ALTERNATIVES[name];
      const altSave = monthlySpend - (alt.monthlyRate * seats);
      if (altSave > 5) {
        alternativeTool = { ...alt, estimatedSaving: altSave };
      }
    }

    // Never recommend spending MORE than current
    if (recommendedSpend > monthlySpend) recommendedSpend = monthlySpend;

    const savings = Math.max(0, monthlySpend - recommendedSpend);
    recommendedTotalSpend += recommendedSpend;

    toolBreakdown.push({
      toolName: name,
      currentPlan: plan,
      currentSpend: monthlySpend,
      seats,
      recommendedPlan,
      recommendedSpend,
      savings,
      annualSavings: savings * 12,
      action,
      reason,
      alternativeTool,
      creditsNote,
    });
  }

  const totalMonthlySavings = Math.max(0, originalTotalSpend - recommendedTotalSpend);
  const totalAnnualSavings  = totalMonthlySavings * 12;
  const hasHighSavings      = totalMonthlySavings >= 500;
  const isAlreadyOptimal    = totalMonthlySavings < 10;

  return {
    originalTotalSpend,
    recommendedTotalSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    toolBreakdown,
    hasHighSavings,
    isAlreadyOptimal,
    teamSize,
    primaryUseCase,
  };
}
