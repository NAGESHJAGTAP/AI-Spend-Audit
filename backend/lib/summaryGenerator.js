// backend/lib/summaryGenerator.js
// Generates a ~100-word personalized AI summary using Anthropic Claude.
// Falls back to a template if the API fails — graceful degradation.

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Fallback template (no API call) ─────────────────────────────────────────
function buildFallbackSummary(auditResult) {
  const { originalTotalSpend, totalMonthlySavings, totalAnnualSavings, toolBreakdown, primaryUseCase, isAlreadyOptimal } = auditResult;

  if (isAlreadyOptimal) {
    return `Your AI stack of ${toolBreakdown.length} tool(s) is well-optimised for a ${primaryUseCase} workflow at $${originalTotalSpend}/mo. You're on the right plans for your team size and use case. We'll notify you as better pricing options emerge — the AI tool market moves fast.`;
  }

  const topTool = [...toolBreakdown].sort((a, b) => b.savings - a.savings)[0];
  return `Your audit reveals $${totalMonthlySavings}/mo ($${totalAnnualSavings}/yr) in actionable savings across ${toolBreakdown.length} AI tool(s). The biggest opportunity is ${topTool?.toolName}: ${topTool?.reason?.slice(0, 120)}. Implementing these recommendations requires no capability trade-offs — just smarter plan selection for your ${primaryUseCase} workflow.`;
}

// ── Main summary generator ───────────────────────────────────────────────────
export async function generateSummary(auditResult) {
  // If no API key configured, skip straight to fallback
  if (!process.env.ANTHROPIC_API_KEY) {
    return buildFallbackSummary(auditResult);
  }

  const { originalTotalSpend, totalMonthlySavings, totalAnnualSavings, toolBreakdown, primaryUseCase, teamSize, isAlreadyOptimal } = auditResult;

  const toolSummary = toolBreakdown
    .map(t => `- ${t.toolName} (${t.currentPlan}): $${t.currentSpend}/mo → $${t.recommendedSpend}/mo, saving $${t.savings}/mo. Reason: ${t.reason}`)
    .join('\n');

  const systemPrompt = `You are a concise, financially literate SaaS spending advisor. 
Write in plain English. No jargon. No hype. Be specific with numbers. 
Sound like a CFO's trusted advisor — direct, credible, actionable.`;

  const userPrompt = `A team of ${teamSize} using AI tools primarily for ${primaryUseCase} just ran a spend audit.

Current total: $${originalTotalSpend}/mo
Potential savings: $${totalMonthlySavings}/mo ($${totalAnnualSavings}/yr)

Per-tool findings:
${toolSummary}

Write a ~100-word personalized summary paragraph (no headings, no bullets) that:
1. Opens with the total savings opportunity
2. Calls out the single most impactful action
3. Notes any redundancy or plan mismatch
4. Closes with a confident, specific next step
5. Sounds like a real advisor, not a marketing bot`;

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 200,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    return message.content[0]?.text ?? buildFallbackSummary(auditResult);
  } catch (err) {
    console.error('[summaryGenerator] Anthropic API error — using fallback:', err.message);
    return buildFallbackSummary(auditResult);
  }
}
