# AI Spend Audit - Test Suite Documentation

This document describes the automated test coverage and execution instructions for the AI Spend Audit application.

## Test Suite Overview

We use **Vitest** as our primary testing framework. The core audit logic is covered by unit tests to ensure mathematical accuracy and defensible optimization recommendations.

---

## Test List

### 1. `tests/auditEngine.test.ts`
This test suite covers the core calculation rules applied to users' tool stacks.

- **Test Case 1**: Solo Cursor Business User Downgrade
  - *Covers*: Detects single-user team sizes on the Cursor Business plan ($40/mo) and recommends downgrading to Cursor Pro ($20/mo), verifying a monthly savings of $20.
- **Test Case 2**: Tool Redundancy Detection (Cursor + Copilot)
  - *Covers*: Identifies double-spending on development assistants (paying for both Cursor and GitHub Copilot) and recommends canceling Copilot, saving the complete Copilot seat spend.
- **Test Case 3**: Claude Team Plan Minimum Seats Check
  - *Covers*: Ensures that teams with fewer than 5 members paying for the Claude Team plan (minimum 5 seats at $30/mo = $150/mo minimum) are recommended to downgrade to Claude Pro ($20/mo per user), verifying a monthly savings of $110 for a 2-user team.
- **Test Case 4**: Already Optimized Check
  - *Covers*: Verifies that an audit containing an already-optimal, standard retail spend (e.g. 1 ChatGPT Plus user at $20/mo) calculates $0 savings and returns `isAlreadyOptimal: true`.
- **Test Case 5**: API Usage Model Routing Optimization
  - *Covers*: Identifies high API spenders (e.g., >$100/mo) and recommends routing ~50% of low-complexity workloads to cheaper models (such as GPT-4o-mini instead of GPT-4o), calculating an expected 40% monthly savings.

---

## Running the Tests

To run the automated tests locally, run:

```bash
npm run test
```

This runs the Vitest test runner in single-run mode and prints a detailed summary of results.
