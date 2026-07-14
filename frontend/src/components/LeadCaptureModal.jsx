// src/components/LeadCaptureModal.jsx
// Modal overlay for lead capture: name, email, company

import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useLead } from '../hooks/useLead';
import { useAuditContext } from '../context/AuditContext';
import { validateLead } from '../utils/validators';

export function LeadCaptureModal() {
  const { goToForm, auditResult } = useAuditContext();
  const { leadStatus, leadError, captureLead } = useLead();

  const [form, setForm] = useState({ name: '', email: '', company: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid, errors: errs } = validateLead(form);
    if (!valid) { setErrors(errs); return; }
    setErrors({});
    await captureLead({ ...form, auditId: auditResult?._id });
  };

  if (leadStatus === 'success') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-10 text-center max-w-md w-full shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Report on its way!</h3>
          <p className="text-slate-400 text-sm mb-6">Check your inbox for your personalized AI savings report.</p>
          <Button variant="secondary" onClick={goToForm}>Start a new audit</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1">Get Your Full Report</h3>
          <p className="text-slate-400 text-sm">We'll email you a detailed breakdown with implementation steps.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Your Name"
            type="text"
            placeholder="Jane Smith"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
          />
          <Input
            label="Work Email"
            type="email"
            placeholder="jane@company.com"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
          />
          <Input
            label="Company Name"
            type="text"
            placeholder="Acme Inc."
            value={form.company}
            onChange={handleChange('company')}
            error={errors.company}
          />

          {leadError && (
            <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{leadError}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={leadStatus === 'loading'}
            className="mt-2"
          >
            Send Me the Report →
          </Button>

          <button
            type="button"
            onClick={goToForm}
            className="text-xs text-slate-500 hover:text-slate-400 transition-colors text-center mt-1"
          >
            No thanks, start over
          </button>
        </form>
      </div>
    </div>
  );
}
