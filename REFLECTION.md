# AI Spend Audit - Development Reflection

This document contains reflections on technical bugs, design decisions, future roadmap, AI tool usage, and self-ratings.

---

## 1. Hardest Bug & Debugging Journey
The hardest bug encountered this week was a runtime crash in the audit engine (`TypeError: Cannot use 'in' operator to search for 'inputPerMillion' in 0`). This error was thrown when running audits containing standard, non-API tools like Cursor on the Hobby plan or Claude on the Free plan. 

### Investigation:
- **Hypothesis 1**: I initially hypothesized that the pricing database (`pricing.js`) was loaded incorrectly or was missing fields. I ran a quick node check and verified that the rates object was correctly structured.
- **Hypothesis 2**: I then suspected that the plans were not being resolved correctly inside the loop. However, adding log lines showed that the correct key (e.g. `'hobby'`) was being looked up.
- **The Culprit**: The bug lay in the standard seat count alignment rule checks: `!('inputPerMillion' in Object.values(rates)[0] ?? {})`. When checking the pricing database for standard tools, the first tier's pricing is `0` (e.g. `hobby: 0` or `free: 0`). `Object.values(rates)[0]` evaluated directly to the primitive number `0`. In JavaScript, the `in` operator throws a TypeError if used on a primitive value (`0`).
- **The Fix**: I rewrote the check to perform a safe type check on the first value:
  ```javascript
  const firstVal = Object.values(rates)[0];
  const isApi = firstVal && typeof firstVal === 'object' && 'inputPerMillion' in firstVal;
  ```
  This resolved the crash immediately, and all 7 test cases passed.

---

## 2. Decision Reversed Mid-Week
Mid-week, I reversed the decision to install `react-router-dom` for client-side routing. 

### Why the reversal?
Initially, I planned to set up standard react-router switches for `/`, `/result`, and `/share/:id`. However, when inspecting the build size and the target hosting platform (such as Vercel or static CDNs), I realized that client-side SPA routing requires setting up specialized fallbacks (which can be fragile on basic CDNs if pages are refreshed). More importantly, the application state was heavily context-driven and shared between the input form, results, and lead capture. Integrating an external router forced double synchronization of step state and route state. 

Instead, I wrote a custom, lightweight URL listener inside [AuditContext.jsx](file:///d:/5semester/AI-Spend-Audit/frontend/src/context/AuditContext.jsx) using standard `window.history.pushState` and `window.location.pathname` parsing on load. This took only 40 lines of code, had zero dependency overhead, and bound browser URL updates directly to our existing context state machine. It simplified testing and kept the JS bundle footprint minimal.

---

## 3. Week 2 Roadmap
If I had a second week to develop this product, I would build these three features:

1. **Active OAuth Integrations**: Instead of manual form inputs, allow users to click a "Connect Slack" or "Connect Google Workspace" button. We would read active user profiles, match them against tool invitations, and auto-discover how many licenses are assigned to inactive team members.
2. **Benchmark Mode**: Introduce a collaborative dataset. Compare a startup's AI spend per employee against companies of similar headcounts and funding rounds (e.g. "Your AI spend is in the 85th percentile for Seed companies").
3. **Automated Downgrade Agent**: Implement an API-based click agent. Once a downgrade recommendation is approved, the tool uses browser automation or API hooks to downgrade the target subscription on the user's behalf, providing a true one-click execution capability.

---

## 4. AI Tool Usage Disclosures
I used AI tools (specifically Gemini 3.5 Flash and Claude) to assist with layout styling in Tailwind CSS, drafting initial test cases, and writing the promotional copy structure. 

### What I didn't trust them with:
I did not trust AI tools to write the core mathematical rules inside [auditEngine.js](file:///d:/5semester/AI-Spend-Audit/backend/lib/auditEngine.js). LLMs consistently struggle with strict seat count bounds, custom credit exclusions, and business math logic. Keeping the math hardcoded and deterministic was non-negotiable for producing credible, finance-grade reasoning.

### When the AI was wrong:
The AI drafted the initial `.github/workflows/ci.yml` but set the Node version to `14.x` and omitted the `cache` configurations. This would have caused build failures on our modern ES6 backend code (which requires Node 18+ to parse ES modules natively). I caught this during review and manually upgraded the Node version to `20.x` and specified the exact package-lock paths for backend and frontend caching.

---

## 5. Self-Rating (1-10 Scale)

- **Discipline**: **9/10** — Maintained a daily log, structured git commits using conventional prefixes, and verified test suites on every incremental change.
- **Code Quality**: **9/10** — Ensured robust variable checks, structured clean separation between the database schemas, API layer, and deterministic logic, and fixed preexisting type check crashes.
- **Design Sense**: **8/10** — Built a sleek, glassmorphic dark-mode interface with violet/indigo accents and responsive cards, prioritizing visual quality for screenshots.
- **Problem Solving**: **9/10** — Successfully debugged and resolved the primitive `in` operator crash and built a custom SPA router to avoid heavy routing packages.
- **Entrepreneurial Thinking**: **10/10** — Tailored GTM, Economics, and Landing copy to a highly specific user profile (Fractional CFOs and Seed-stage Operations managers), maximizing lead generation efficiency.
