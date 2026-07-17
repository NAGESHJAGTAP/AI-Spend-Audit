// backend/routes/audit.js
// POST /api/audit      — run audit, save to DB, return result
// GET  /api/audit/share/:shareId — fetch public shareable audit

import express from 'express';
import rateLimit from 'express-rate-limit';
import { nanoid } from 'nanoid';
import { runAudit } from '../lib/auditEngine.js';
import { generateSummary } from '../lib/summaryGenerator.js';
import { Audit } from '../models/Audit.js';

const router = express.Router();

// ── Rate limiting: 20 audits per IP per 15 min ───────────────────────────────
const auditLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many audits. Please wait a few minutes.' },
});

// ── POST /api/audit ───────────────────────────────────────────────────────────
router.post('/', auditLimiter, async (req, res) => {
  try {
    const { teamSize, primaryUseCase, tools } = req.body;

    // Basic input validation
    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      return res.status(400).json({ error: 'Provide at least one tool in the "tools" array.' });
    }
    if (tools.length > 20) {
      return res.status(400).json({ error: 'Maximum 20 tools per audit.' });
    }

    // 1. Run deterministic audit
    const auditResult = runAudit({ teamSize, primaryUseCase, tools });

    // 2. Generate AI summary (with fallback)
    const aiSummary = await generateSummary(auditResult);

    // 3. Persist to MongoDB
    const shareId = nanoid(10);
    const audit = await Audit.create({
      shareId,
      teamSize,
      primaryUseCase,
      ...auditResult,
      aiSummary,
      ip: req.ip,
    });

    return res.status(201).json({
      _id:      audit._id,
      shareId:  audit.shareId,
      aiSummary,
      ...auditResult,
    });

  } catch (err) {
    console.error('[POST /audit]', err);
    return res.status(500).json({ error: 'Audit failed. Please try again.' });
  }
});

// ── GET /api/audit/share/:shareId ─────────────────────────────────────────────
router.get('/share/:shareId', async (req, res) => {
  // Hard timeout so share pages never get stuck on loading.
  // If MongoDB stalls, fail fast with 504.
  const timeoutMs = Number(process.env.SHARE_ROUTE_TIMEOUT_MS || 3500);

  const timeout = setTimeout(() => {
    return res.status(504).json({ error: 'Timed out loading shared audit.' });
  }, timeoutMs);

  try {
    // Fast-fail query: only fetch what the UI needs.
    const audit = await Audit.findOne(
      { shareId: req.params.shareId },
      '-ip -leadId'
    ).lean();

    if (!audit) return res.status(404).json({ error: 'Audit not found.' });
    return res.json(audit);
  } catch (err) {
    console.error('[GET /audit/share]', err);
    return res.status(500).json({ error: 'Failed to load audit.' });
  } finally {
    clearTimeout(timeout);
  }
});

export default router;
