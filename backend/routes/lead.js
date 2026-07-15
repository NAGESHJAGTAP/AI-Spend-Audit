// backend/routes/lead.js
// POST /api/lead — capture email, link to audit, send transactional email

import express from 'express';
import rateLimit from 'express-rate-limit';
import { Lead } from '../models/Lead.js';
import { Audit } from '../models/Audit.js';
import { sendAuditEmail } from '../lib/email.js';

const router = express.Router();

// ── Rate limiting: 5 lead submits per IP per hour ───────────────────────────
const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in an hour.' },
});

// ── POST /api/lead ────────────────────────────────────────────────────────────
router.post('/', leadLimiter, async (req, res) => {
  try {
    const { name, email, company, role, teamSize, auditId, honeypot } = req.body;

    // ── Abuse protection 1: honeypot field must be empty ─────────────────────
    if (honeypot) {
      // Return 200 to fool bots — don't reveal the trap
      return res.status(200).json({ ok: true });
    }

    // ── Basic validation ──────────────────────────────────────────────────────
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email address required.' });
    }

    // ── Fetch linked audit ────────────────────────────────────────────────────
    let audit = null;
    if (auditId) {
      audit = await Audit.findById(auditId);
    }

    // ── Save lead ─────────────────────────────────────────────────────────────
    const lead = await Lead.create({
      name:           name?.trim(),
      email:          email.toLowerCase().trim(),
      company:        company?.trim(),
      role:           role?.trim(),
      teamSize,
      auditId:        audit?._id ?? null,
      ip:             req.ip,
      honeypot:       honeypot ?? '',
      hasHighSavings: audit?.hasHighSavings ?? false,
      isConsultLead:  (audit?.totalMonthlySavings ?? 0) >= 500,
    });

    // ── Link lead back to audit ───────────────────────────────────────────────
    if (audit) {
      await Audit.findByIdAndUpdate(audit._id, { leadId: lead._id });
    }

    // ── Send transactional email (non-blocking) ───────────────────────────────
    const shareUrl = `${process.env.APP_URL || 'http://localhost:3000'}/share/${audit?.shareId}`;
    sendAuditEmail({
      to:          email,
      name:        name,
      auditResult: audit ?? {},
      shareUrl,
    }).then(async ({ ok }) => {
      await Lead.findByIdAndUpdate(lead._id, {
        emailedAt:   ok ? new Date() : null,
        emailStatus: ok ? 'sent' : 'failed',
      });
    }).catch(console.error);

    return res.status(201).json({ ok: true, leadId: lead._id });

  } catch (err) {
    // Duplicate email+audit — return 200 silently
    if (err.code === 11000) return res.status(200).json({ ok: true });
    console.error('[POST /lead]', err);
    return res.status(500).json({ error: 'Could not save your details. Please try again.' });
  }
});

export default router;
