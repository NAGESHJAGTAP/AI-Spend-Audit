// backend/server.js
// Express entry point

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import auditRouter   from './routes/audit.js';
import leadRouter    from './routes/lead.js';
import summaryRouter from './routes/summary.js';

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — allow local frontend + deployed frontend ──────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.APP_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '100kb' }));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// ── API routes ───────────────────────────────────────────────────────────────
app.use('/api/audit',   auditRouter);
app.use('/api/lead',    leadRouter);
app.use('/api/summary', summaryRouter);

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[server] Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Boot ─────────────────────────────────────────────────────────────────────
async function start() {
  await connectDB();
  app.listen(PORT, () => console.log(`[server] Listening on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error('[server] Failed to start:', err.message);
  process.exit(1);
});
