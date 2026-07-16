// backend/tests/auditEngine.test.js
// Vitest tests for the deterministic audit engine
// Run: cd backend && npm test

import { describe, it, expect } from 'vitest';
import { runAudit } from '../lib/auditEngine.js';

// ── Test 1: Copilot cancelled when Cursor present ────────────────────────────
describe('Rule 1 — Copilot + Cursor redundancy', () => {
  it('should recommend cancelling GitHub Copilot when Cursor is in the stack', () => {
    const result = runAudit({
      teamSize: 3,
      primaryUseCase: 'coding',
      tools: [
        { name: 'cursor',  plan: 'pro',        seats: 3, monthlySpend: 60 },
        { name: 'copilot', plan: 'individual', seats: 3, monthlySpend: 30 },
      ],
    });

    const copilot = result.toolBreakdown.find(t => t.toolName === 'copilot');
    expect(copilot.action).toBe('cancel');
    expect(copilot.recommendedSpend).toBe(0);
    expect(copilot.savings).toBe(30);
    expect(result.totalMonthlySavings).toBe(30);
  });
});

// ── Test 2: Claude Team < 5 seats → downgrade to Pro ────────────────────────
describe('Rule 3 — Claude Team seat minimum', () => {
  it('should downgrade Claude Team to Pro when team has fewer than 5 seats', () => {
    const result = runAudit({
      teamSize: 3,
      primaryUseCase: 'writing',
      tools: [
        { name: 'claude', plan: 'team', seats: 3, monthlySpend: 150 }, // 5-seat min enforced
      ],
    });

    const claude = result.toolBreakdown.find(t => t.toolName === 'claude');
    expect(claude.action).toBe('downgrade');
    expect(claude.recommendedPlan).toBe('pro');
    expect(claude.recommendedSpend).toBe(60); // 3 × $20
    expect(claude.savings).toBe(90);
  });
});

// ── Test 3: Solo on Cursor Business → downgrade to Pro ──────────────────────
describe('Rule 5 — Cursor Business solo downgrade', () => {
  it('should recommend downgrading solo Cursor Business to Pro', () => {
    const result = runAudit({
      teamSize: 1,
      primaryUseCase: 'coding',
      tools: [
        { name: 'cursor', plan: 'business', seats: 1, monthlySpend: 40 },
      ],
    });

    const cursor = result.toolBreakdown.find(t => t.toolName === 'cursor');
    expect(cursor.action).toBe('downgrade');
    expect(cursor.recommendedSpend).toBe(20);
    expect(cursor.savings).toBe(20);
  });
});

// ── Test 4: OpenAI API optimization ─────────────────────────────────────────
describe('Rule 8 — OpenAI API model-mix optimization', () => {
  it('should suggest model-mix optimization for high OpenAI API spend', () => {
    const result = runAudit({
      teamSize: 5,
      primaryUseCase: 'data',
      tools: [
        { name: 'openaiApi', plan: 'gpt4o', seats: 1, monthlySpend: 200 },
      ],
    });

    const openai = result.toolBreakdown.find(t => t.toolName === 'openaiApi');
    expect(openai.action).toBe('optimize-api');
    expect(openai.recommendedSpend).toBeLessThan(200);
    expect(openai.savings).toBeGreaterThan(0);
  });
});

// ── Test 5: ChatGPT cancelled alongside Claude for writing ──────────────────
describe('Rule 2 — ChatGPT + Claude redundancy for writing', () => {
  it('should cancel ChatGPT Plus when Claude is present for writing use case', () => {
    const result = runAudit({
      teamSize: 4,
      primaryUseCase: 'writing',
      tools: [
        { name: 'chatgpt', plan: 'plus',  seats: 4, monthlySpend: 80 },
        { name: 'claude',  plan: 'pro',   seats: 4, monthlySpend: 80 },
      ],
    });

    const chatgpt = result.toolBreakdown.find(t => t.toolName === 'chatgpt');
    expect(chatgpt.action).toBe('cancel');
    expect(chatgpt.savings).toBe(80);
  });
});

// ── Test 6: Already-optimal stack returns isAlreadyOptimal ──────────────────
describe('Optimal stack detection', () => {
  it('should flag isAlreadyOptimal when savings are below $10/mo', () => {
    const result = runAudit({
      teamSize: 1,
      primaryUseCase: 'coding',
      tools: [
        { name: 'cursor', plan: 'pro', seats: 1, monthlySpend: 20 },
      ],
    });

    expect(result.isAlreadyOptimal).toBe(true);
    expect(result.totalMonthlySavings).toBeLessThan(10);
  });
});

// ── Test 7: High savings flag triggers at $500/mo ────────────────────────────
describe('High savings flag', () => {
  it('should set hasHighSavings=true when monthly savings exceed $500', () => {
    const result = runAudit({
      teamSize: 2,
      primaryUseCase: 'mixed',
      tools: [
        { name: 'claude',    plan: 'team',  seats: 2, monthlySpend: 150 },
        { name: 'chatgpt',   plan: 'team',  seats: 2, monthlySpend: 200 },
        { name: 'openaiApi', plan: 'gpt4o', seats: 1, monthlySpend: 600 },
        { name: 'cursor',    plan: 'business', seats: 2, monthlySpend: 80 },
        { name: 'copilot',   plan: 'business', seats: 2, monthlySpend: 38 },
      ],
    });

    expect(result.hasHighSavings).toBe(true);
    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(500);
  });
});
