// backend/models/Audit.js
// Stores every audit result — public fields accessible via shareId

import mongoose from 'mongoose';

const ToolBreakdownSchema = new mongoose.Schema({
  toolName:         String,
  currentPlan:      String,
  currentSpend:     Number,
  seats:            Number,
  recommendedPlan:  String,
  recommendedSpend: Number,
  savings:          Number,
  annualSavings:    Number,
  action:           String,
  reason:           String,
  alternativeTool:  mongoose.Schema.Types.Mixed,
  creditsNote:      String,
}, { _id: false });

const AuditSchema = new mongoose.Schema({
  // ── Public share ──────────────────────────────────────────────────
  shareId: {
    type:     String,
    required: true,
    unique:   true,
    index:    true,
  },

  // ── Input summary ────────────────────────────────────────────────
  teamSize:       { type: Number, default: 1 },
  primaryUseCase: { type: String, default: 'mixed' },

  // ── Audit results ────────────────────────────────────────────────
  originalTotalSpend:    { type: Number, required: true },
  recommendedTotalSpend: { type: Number, required: true },
  totalMonthlySavings:   { type: Number, required: true },
  totalAnnualSavings:    { type: Number, required: true },
  hasHighSavings:        { type: Boolean, default: false },
  isAlreadyOptimal:      { type: Boolean, default: false },
  toolBreakdown:         [ToolBreakdownSchema],

  // ── AI summary ───────────────────────────────────────────────────
  aiSummary: { type: String, default: '' },

  // ── Meta ─────────────────────────────────────────────────────────
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', default: null },
  ip:     { type: String, select: false },        // never in public API
}, { timestamps: true });

export const Audit = mongoose.model('Audit', AuditSchema);
