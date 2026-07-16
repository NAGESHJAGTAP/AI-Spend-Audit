// backend/routes/summary.js
// POST /api/summary — standalone summary endpoint
// Accepts an audit result object and returns a ~100-word AI-generated insight.
// Falls back gracefully if the Anthropic API key is not set.

import express from 'express';
import rateLimit from 'express-rate-limit';
import { generateSummary } from '../lib/summaryGenerator.js';

const router = express.Router();

// ── Rate limiting: 10 summary requests per IP per 15 min ─────────────────────
const summaryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many summary requests. Please wait a few minutes.' },
});

// ── POST /api/summary ─────────────────────────────────────────────────────────
// Body: the full auditResult object (same shape returned by POST /api/audit)
router.post('/', summaryLimiter, async (req, res) => {
  try {
    const auditResult = req.body;

    // Minimal validation
    if (!auditResult || typeof auditResult !== 'object') {
      return res.status(400).json({ error: 'Provide an auditResult object in the request body.' });
    }
    if (!Array.isArray(auditResult.toolBreakdown)) {
      return res.status(400).json({ error: 'auditResult.toolBreakdown must be an array.' });
    }

    const summary = await generateSummary(auditResult);
    return res.json({ summary });

  } catch (err) {
    console.error('[POST /summary]', err);
    return res.status(500).json({ error: 'Failed to generate summary. Please try again.' });
  }
});

export default router;
