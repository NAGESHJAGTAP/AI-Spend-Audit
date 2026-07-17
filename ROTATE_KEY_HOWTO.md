# Anthropic API Key: how to fix (secure + works)

## 1) Remove exposed key from chat / repo
- Tumne jo key message me paste ki hai woh **public/unsafe** hai.
- Anthropic dashboard me jaa kar **rotate** (new key generate) kar do.

## 2) Set key in environment (do not commit)
### Option A: `backend/.env` file
1. `backend` folder me `.env` create karo: `backend/.env`
2. Is format me set karo:
   ```bash
   ANTHROPIC_API_KEY=your_new_key_here
   ```
3. `backend/.env` ko git se exclude karna sure karo (repo me `.gitignore` me hoga).

### Option B: run-time env var
Backend start karte waqt set karo:
```bat
set ANTHROPIC_API_KEY=your_new_key_here
node backend/server.js
```

## 3) Verify key is loaded
Run:
```bash
node -e "console.log(!!process.env.ANTHROPIC_API_KEY, (process.env.ANTHROPIC_API_KEY||'').length)"
```
Expected:
- `true` and non-zero length.

## 4) Test the app
- `POST /api/audit` hit karo.
- Agar key valid hua to `backend/lib/summaryGenerator.js` me Anthropic `messages.create()` chalega.
- Agar key absent/invalid hua to fallback summary banega.

## What I checked in this repo
- `backend/lib/summaryGenerator.js` uses `process.env.ANTHROPIC_API_KEY`.
- Current environment me key loaded nahi hai:
  - `ANTHROPIC_API_KEY set: false`
  - `len: 0`
So API call nahi chal raha tha.

