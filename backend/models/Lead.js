// backend/models/Lead.js
// Stores email captures — PII excluded from public audit share

import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  name:     { type: String, trim: true },
  email:    { type: String, required: true, lowercase: true, trim: true },
  company:  { type: String, trim: true },
  role:     { type: String, trim: true },
  teamSize: { type: Number },

  auditId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Audit' },

  // Metadata for abuse protection
  ip:           { type: String, select: false },
  honeypot:     { type: String, select: false }, // must be empty — bot trap
  emailedAt:    { type: Date, default: null },
  emailStatus:  { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },

  // Segmentation
  hasHighSavings: { type: Boolean, default: false },
  isConsultLead:  { type: Boolean, default: false },
}, { timestamps: true });

// Prevent duplicate lead on same email per audit
LeadSchema.index({ email: 1, auditId: 1 }, { unique: true });

export const Lead = mongoose.model('Lead', LeadSchema);
