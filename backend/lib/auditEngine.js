import { PRICING } from '../config/pricing.js';

export function runAudit(input) {
  const { teamSize, primaryUseCase, tools } = input;
  const toolBreakdown = [];
  let originalTotalSpend = 0;
  let recommendedTotalSpend = 0;

  const hasCursor = tools.some(t => t.name === 'cursor');
  const hasClaude = tools.some(t => t.name === 'claude');

  for (const tool of tools) {
    const { name, plan, monthlySpend, seats } = tool;
    originalTotalSpend += Number(monthlySpend);

    let recommendedPlan = plan;
    let recommendedSpend = Number(monthlySpend);
    let reason = 'You are on the optimal plan for your team size and usecase.';
    let alternativeTool;
    let creditsRecommendation;

    // Rule 1: Redundancy - Cursor and Copilot together
    if (name === 'copilot' && hasCursor) {
      recommendedPlan = 'none';
      recommendedSpend = 0;
      reason = 'Redundant tool detected. Since Cursor has its own advanced autocomplete and chat powered by top models, GitHub Copilot is unnecessary. Canceling it saves the entire spend.';
    }
    // Rule 2: Redundancy - ChatGPT Plus and Claude Pro together (Mixed or writing use case)
    else if (name === 'chatgpt' && plan === 'plus' && hasClaude && (primaryUseCase === 'writing' || primaryUseCase === 'mixed')) {
      recommendedPlan = 'none';
      recommendedSpend = 0;
      reason = `Redundant general-purpose AI assistant. Your team is also paying for Claude Pro. Consolidating on Claude Pro for your ${primaryUseCase} use case saves $20/mo per user.`;
    }
    // Rule 3: Claude Team plan 5-seat minimum violation
    else if (name === 'claude' && plan === 'team') {
      const minSeats = 5;
      const ratePerSeat = PRICING.claude.team;
      const expectedMinSpend = minSeats * ratePerSeat;

      if (teamSize < minSeats && monthlySpend >= expectedMinSpend) {
        recommendedPlan = 'pro';
        recommendedSpend = teamSize * PRICING.claude.pro;
        reason = `Claude Team plan enforces a 5-seat minimum ($150/mo). Downgrading to Claude Pro ($20/mo per user) for your team of ${teamSize} reduces monthly spend to $${recommendedSpend}/mo.`;
      } else {
        recommendedSpend = seats * ratePerSeat;
      }
    }
    // Rule 4: ChatGPT Team plan 2-seat minimum violation
    else if (name === 'chatgpt' && plan === 'team') {
      const minSeats = 2;
      const ratePerSeat = PRICING.chatgpt.team;
      const expectedMinSpend = minSeats * ratePerSeat;

      if (teamSize < minSeats && monthlySpend >= expectedMinSpend) {
        recommendedPlan = 'plus';
        recommendedSpend = teamSize * PRICING.chatgpt.plus;
        reason = `ChatGPT Team plan enforces a 2-seat minimum ($60/mo). Downgrading to ChatGPT Plus ($20/mo per user) for your team of ${teamSize} reduces monthly spend to $${recommendedSpend}/mo.`;
      } else {
        recommendedSpend = seats * ratePerSeat;
      }
    }
    // Rule 5: Solo user on Enterprise or Business plans
    else if (name === 'cursor' && plan === 'business' && teamSize === 1) {
      recommendedPlan = 'pro';
      recommendedSpend = PRICING.cursor.pro;
      reason = 'Solo developer detected on Cursor Business ($40/mo). Downgrading to Cursor Pro ($20/mo) provides identical AI coding capabilities while cutting costs in half.';
    }
    else if (name === 'copilot' && plan === 'business' && teamSize === 1) {
      recommendedPlan = 'individual';
      recommendedSpend = PRICING.copilot.individual;
      reason = 'Solo developer detected on Copilot Business ($19/mo). Downgrading to Copilot Individual ($10/mo) provides identical AI autocomplete coding capabilities.';
    }
    // Rule 6: API Direct Optimizations
    else if (name === 'openaiApi' && monthlySpend > 50) {
      const possibleSavings = monthlySpend * 0.40;
      recommendedSpend = monthlySpend - possibleSavings;
      reason = 'High OpenAI API spend detected. Shifting ~50% of simple workloads (like classification or text formatting) to GPT-4o-mini ($0.15/M input) instead of GPT-4o ($2.50/M input) can cut your API bill by 40%.';
    }
    else if (name === 'anthropicApi' && monthlySpend > 50) {
      const possibleSavings = monthlySpend * 0.35;
      recommendedSpend = monthlySpend - possibleSavings;
      reason = 'High Anthropic API spend detected. Route low-complexity prompts (summarization, structured outputs) to Claude 3.5 Haiku ($0.80/M input) instead of Claude 3.5 Sonnet ($3.00/M input) for ~35% savings.';
    }
    else {
      const rates = PRICING[name];
      if (rates && typeof rates === 'object' && !( 'inputPerMillion' in rates )) {
        const rate = rates[plan] ?? 0;
        const expectedSpend = rate * seats;
        if (monthlySpend > expectedSpend && expectedSpend > 0) {
          recommendedSpend = expectedSpend;
          reason = `Your reported spend is higher than the standard retail pricing of $${rate}/seat/mo. Aligning to standard billing rates of $${expectedSpend}/mo.`;
        }
      }
    }

    if ((name === 'openaiApi' || name === 'anthropicApi' || name === 'geminiApi') && monthlySpend >= 100 && teamSize < 15) {
      creditsRecommendation = 'As an early-stage startup, you are eligible for up to $100,000 in free API credits through AWS Activate or Microsoft for Startups Founders Hub. This would cover your entire API spend.';
    }

    if (recommendedSpend > monthlySpend) {
      recommendedSpend = monthlySpend;
    }

    const savings = Math.max(0, monthlySpend - recommendedSpend);
    recommendedTotalSpend += recommendedSpend;

    toolBreakdown.push({
      toolName: name,
      currentPlan: plan,
      currentSpend: monthlySpend,
      recommendedPlan,
      recommendedSpend,
      savings,
      reason,
      alternativeTool,
      creditsRecommendation,
    });
  }

  const totalMonthlySavings = Math.max(0, originalTotalSpend - recommendedTotalSpend);
  const totalAnnualSavings = totalMonthlySavings * 12;

  const hasHighSavings = totalMonthlySavings > 500;
  const isAlreadyOptimal = totalMonthlySavings < 100;

  return {
    originalTotalSpend,
    recommendedTotalSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    toolBreakdown,
    hasHighSavings,
    isAlreadyOptimal,
  };
}
