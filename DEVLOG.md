# DEVLOG - AI Spend Audit Development

## Day 1 — 2026-07-15
**Hours worked:** 3
**What I did:**
- Restructured workspace from Next.js + TypeScript to MERN stack (React frontend + Express Node.js backend) in plain JavaScript, as requested.
- Cleaned up previous Next.js files and empty TypeScript files.
- Formulated the workspace architecture inside `ARCHITECTURE.md`.
- Created `backend/` directory structure and configured `backend/package.json` with Express, CORS, Mongoose, Resend, and Vitest.
- Populated static pricing configurations inside `backend/config/pricing.js` and verified references against vendor urls in `PRICING_DATA.md`.
- Wrote the core audit calculation rules engine in `backend/lib/auditEngine.js` using ES6 imports.
- Created `backend/tests/auditEngine.test.js` with 5 detailed test cases covering calculations.
- Updated documentation files: `PRICING_DATA.md`, `PROMPTS.md`, and `TESTS.md`.

**What I learned:**
- Swapped next-router logic for simple Express routing to maintain clear separation of concerns in pure JavaScript.
- Configured Vitest to run natively on ES6 Javascript modules by setting `"type": "module"` in `package.json`.

**Plan for tomorrow:**
- Day 2: Implement Mongoose database helper and Audit/Lead schemas, configure the Gemini LLM client for summary generation, set up the Resend email agent, and construct the Express API endpoints.

## Day 2 — 2026-07-16
**Hours worked:** 4
**What I did:**
- Resolved npm install blockers and verified backend local boot.
- Designed and wrote a reactive SPA routing solution in `AuditContext.jsx` and `App.jsx` using pathname matching (`/share/:id`, `/result`).
- Implemented `vercel.json` rewrite directives inside `frontend/` to support client-side SPA routing.
- Corrected frontend data mappings in `AuditResults.jsx` to map backend response keys perfectly.
- Designed premium results cards for high savings (Techvruk expert consult) and honest notifications for low savings/optimal stacks.
- Upgraded the lead capture modal to support optional Role and Team Size parameters, integrating a honeypot anti-abuse input.
- Added safety checks in backend `email.js` to prevent crashes when `RESEND_API_KEY` is omitted locally.
- Configured a green CI pipeline in `.github/workflows/ci.yml`.
- Ran Vitest backend unit tests, resolved a billing type check crash (TypeError using primitive values on `in` operator), and achieved 100% test success.
- Drafted marketing/financial documents (`README.md`, `GTM.md`, `ECONOMICS.md`, `LANDING_COPY.md`, `METRICS.md`, and `USER_INTERVIEWS.md`).

**What I learned:**
- Evaluated why the `in` operator throws TypeErrors on primitive types (like 0 in Hobby plans) in JavaScript and how to perform safe type guard checks.
- Synchronized browser history navigation (`window.history.pushState`) with custom React context state to build lightweight SPA routing.

**Blockers / what I'm stuck on:**
- None. All MVP features are functional, building, and tested.

**Plan for tomorrow:**
- Day 3: Hook up live MongoDB Atlas database, deploy the backend to Render, deploy the frontend to Vercel, and test the end-to-end integration live.
