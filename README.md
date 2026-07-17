# AI Spend Audit

AI Spend Audit is a free, premium MERN web application that acts as "Mint for AI tool spend." It analyzes a team's AI subscriptions (Cursor, ChatGPT, Claude, Gemini, etc.), programmatically detects redundancies, seat inefficiencies, and plan mismatches, and synthesizes the findings into a clean savings report with an AI-generated advisor summary.

Live Deployed URL: **[https://ai-spend-audit.vercel.app](https://ai-spend-audit.vercel.app)** 

---
Frontend Deployed URL: **https://ai-spend-audit.vercel.app**

---

Backend Deployed URL : **https://ai-spend-audit-2-qijt.onrender.com/**


 
## Screen Recording / Screenshots
- Demo Screen Recording: **[Walkthrough Video Link](https://youtube.com/)** *(replace with your Loom/YouTube walkthrough)*

---

## Quick Start

### 1. Prerequisites
- **Node.js**: v18.x or v20.x
- **MongoDB**: A running local MongoDB database or MongoDB Atlas URI.
- **API Keys**: Anthropic API Key (for summaries), Resend API Key (for emails).

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and fill in `MONGO_URI`, `ANTHROPIC_API_KEY`, and `RESEND_API_KEY`.*
4. Start the server:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:5000`.*

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   *The client runs on `http://localhost:3000`.*

### 4. Running Tests
To run unit tests for the audit engine:
```bash
cd backend
npm run test
```

---

## Decisions & Trade-offs

1. **Lightweight Custom Router vs React Router**: Instead of installing `react-router-dom` and adding extra packages, we implemented a reactive URL pathname listener inside the React context. This handles deep links like `/share/:id` and routes smoothly back to `/` on refresh without complex bundler configurations, maintaining an ultra-lightweight client bundle.
2. **Deterministic Calculations vs LLM Calculations**: We perform all math, seat limit enforcements, and redundant tool checks using deterministic JS rules (`auditEngine.js`) rather than prompts. This ensures the output is 100% accurate, defensible, and fast, using the Anthropic API only for the final natural-language summary synthesis.
3. **Resend Safe Fallback for Local Dev**: We conditionally instantiate the Resend transactional email agent. If `RESEND_API_KEY` is missing in the local environment, the backend logs a warning and proceeds without crashing, allowing developers to test the backend API out-of-the-box.
4. **localStorage for Draft Persistence**: Form state and draft values are saved to browser `localStorage`. This ensures form inputs persist across page reloads without loading the database with temporary, incomplete sessions from anonymous visitors.
5. **Plain JavaScript over TypeScript**: Plain ES6 JavaScript was utilized to simplify local builds and avoid TypeScript transpilation overhead. This prioritizes speed of iteration and fits the MERN boilerplate environment while maintaining strict JSDoc comments for typing support.
