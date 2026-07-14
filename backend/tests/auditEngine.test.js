import { describe, it, expect } from 'vitest';
import { runAudit } from '../lib/auditEngine.js';

describe('Audit Calculation Engine', () => {
  it('should recommend solo Cursor Business user to downgrade to Pro', () => {
    const input = {
      teamSize: 1,
      primaryUseCase: 'coding',
      tools: [
        {
          name: 'cursor',
          plan: 'business',
          monthlySpend: 40,
          seats: 1,
        },
      ],
    };

    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBe(20);
    expect(result.recommendedTotalSpend).toBe(20);
    expect(result.toolBreakdown[0].recommendedPlan).toBe('pro');
    expect(result.toolBreakdown[0].savings).toBe(20);
  });

  it('should identify redundancy when both Cursor and Copilot are active', () => {
    const input = {
      teamSize: 3,
      primaryUseCase: 'coding',
      tools: [
        { name: 'cursor', plan: 'pro', monthlySpend: 60, seats: 3 },
        { name: 'copilot', plan: 'individual', monthlySpend: 30, seats: 3 },
      ],
    };

    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBe(30);
    const copilotRecommendation = result.toolBreakdown.find(t => t.toolName === 'copilot');
    expect(copilotRecommendation.recommendedPlan).toBe('none');
    expect(copilotRecommendation.recommendedSpend).toBe(0);
    expect(copilotRecommendation.savings).toBe(30);
  });

  it('should recommend Claude Team plan downgrade if team size is below 5 seat minimum', () => {
    const input = {
      teamSize: 2,
      primaryUseCase: 'mixed',
      tools: [
        { name: 'claude', plan: 'team', monthlySpend: 150, seats: 5 },
      ],
    };

    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBe(110);
    expect(result.recommendedTotalSpend).toBe(40);
    expect(result.toolBreakdown[0].recommendedPlan).toBe('pro');
  });

  it('should return optimal status when user spends are already optimized', () => {
    const input = {
      teamSize: 1,
      primaryUseCase: 'writing',
      tools: [
        { name: 'chatgpt', plan: 'plus', monthlySpend: 20, seats: 1 },
      ],
    };

    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.isAlreadyOptimal).toBe(true);
  });

  it('should suggest routing API workloads to cheaper models for high API spenders', () => {
    const input = {
      teamSize: 5,
      primaryUseCase: 'data',
      tools: [
        { name: 'openaiApi', plan: 'direct', monthlySpend: 200, seats: 1 },
      ],
    };

    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBe(80);
    expect(result.toolBreakdown[0].savings).toBe(80);
  });
});
