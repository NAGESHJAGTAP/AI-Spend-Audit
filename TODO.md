# TODO — AI Spend Audit submission hardening

- [ ] Verify OG/Twitter preview works for `GET /share/:shareId` (server-rendered HTML)
- [ ] Ensure backend server boots after adding OG route (no ReferenceErrors)
- [ ] Ensure CI runs lint + tests on push to `main` with green checks (add lint steps / scripts)
- [ ] Update `DEVLOG.md` to have Day 1..Day 7 entries in the exact required format
- [ ] Replace placeholders in `USER_INTERVIEWS.md` with 3 real interviews
- [ ] Update `PROMPTS.md` to include the exact LLM prompt(s) used in the code
- [ ] Fix `ARCHITECTURE.md` to match actual stack (Anthropic used)
- [ ] Ensure `TESTS.md` accurately lists every automated test file and how to run them
- [ ] Reconcile `PRICING_DATA.md` with numbers used in `backend/config/pricing.js` and any numeric claims in audit reasoning
- [ ] Final run: `cd backend && npm test` and `cd frontend && npm run build`

