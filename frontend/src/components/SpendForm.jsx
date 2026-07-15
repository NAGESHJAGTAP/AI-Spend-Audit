// src/components/SpendForm.jsx
// Full multi-tool spend form with team context, all required tools, and localStorage persistence

import { useState } from 'react';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';
import { Card } from './ui/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAudit } from '../hooks/useAudit';
import { useAuditContext } from '../context/AuditContext';
import { TOOLS, TIERS, DEFAULT_TIERS, USE_CASES, DEFAULT_TOOL_ENTRY, LS_FORM_KEY, LS_TEAM_KEY } from '../utils/constants';

const DEFAULT_TEAM = { teamSize: 1, primaryUseCase: 'mixed' };

export function SpendForm() {
  const [entries, setEntries] = useLocalStorage(LS_FORM_KEY, [{ ...DEFAULT_TOOL_ENTRY }]);
  const [team, setTeam]       = useLocalStorage(LS_TEAM_KEY, DEFAULT_TEAM);
  const [errors, setErrors]   = useState([{}]);
  const [teamErr, setTeamErr] = useState({});
  const { runAudit, loading, error: apiError } = useAudit();
  const { goToResults } = useAuditContext();

  // ── Entry helpers ─────────────────────────────────────────────────────────
  const addEntry = () => {
    setEntries(prev => [...prev, { ...DEFAULT_TOOL_ENTRY }]);
    setErrors(prev => [...prev, {}]);
  };

  const removeEntry = idx => {
    setEntries(prev => prev.filter((_, i) => i !== idx));
    setErrors(prev => prev.filter((_, i) => i !== idx));
  };

  const updateEntry = (idx, field, value) => {
    setEntries(prev => prev.map((e, i) => {
      if (i !== idx) return e;
      const updated = { ...e, [field]: value };
      // Auto-set default plan when tool changes
      if (field === 'name') updated.plan = DEFAULT_TIERS[value] || '';
      return updated;
    }));
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    let ok = true;
    const errs = entries.map(e => {
      const err = {};
      if (!e.name) { err.name = 'Select a tool'; ok = false; }
      if (!e.plan) { err.plan = 'Select a plan'; ok = false; }
      if (!e.seats || e.seats < 1) { err.seats = 'Min 1'; ok = false; }
      return err;
    });
    const tErr = {};
    if (!team.teamSize || team.teamSize < 1) { tErr.teamSize = 'Required'; ok = false; }
    if (!team.primaryUseCase) { tErr.primaryUseCase = 'Required'; ok = false; }
    setErrors(errs);
    setTeamErr(tErr);
    return ok;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    const result = await runAudit({ ...team, tools: entries });
    if (result) goToResults(result, entries);
  };

  const tiersForEntry = idx => {
    const toolName = entries[idx]?.name;
    return toolName ? (TIERS[toolName] || []) : [];
  };

  return (
    <section id="audit" className="max-w-3xl mx-auto px-4">
      <div className="text-center mb-10 animate-fade-in-up">
        <h2 className="text-3xl font-bold text-white mb-3">Audit Your AI Stack</h2>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          Add every AI tool your team pays for. We'll calculate exact savings in 30 seconds — no signup required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* ── Team context ───────────────────────────────────────── */}
        <Card glow>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Your Team</p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Team Size"
              type="number"
              min="1"
              max="10000"
              placeholder="e.g. 5"
              value={team.teamSize}
              onChange={e => setTeam(t => ({ ...t, teamSize: Number(e.target.value) }))}
              error={teamErr.teamSize}
            />
            <Select
              label="Primary Use Case"
              options={USE_CASES}
              value={team.primaryUseCase}
              onChange={e => setTeam(t => ({ ...t, primaryUseCase: e.target.value }))}
              error={teamErr.primaryUseCase}
            />
          </div>
        </Card>

        {/* ── Tool entries ───────────────────────────────────────── */}
        {entries.map((entry, idx) => (
          <Card key={idx} glow className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Tool #{idx + 1}
              </span>
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEntry(idx)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="AI Tool"
                options={TOOLS.map(t => ({ value: t.value, label: t.label }))}
                value={entry.name}
                onChange={e => updateEntry(idx, 'name', e.target.value)}
                error={errors[idx]?.name}
              />
              <Select
                label="Pricing Plan"
                options={tiersForEntry(idx)}
                placeholder={entry.name ? 'Select plan...' : '← Pick a tool first'}
                value={entry.plan}
                onChange={e => updateEntry(idx, 'plan', e.target.value)}
                error={errors[idx]?.plan}
              />
              <Input
                label="Seats / Licenses"
                type="number"
                min="1"
                placeholder="e.g. 5"
                value={entry.seats}
                onChange={e => updateEntry(idx, 'seats', Number(e.target.value))}
                error={errors[idx]?.seats}
              />
              <Input
                label="Monthly Spend (USD)"
                type="number"
                min="0"
                placeholder="Leave blank to auto-calculate"
                value={entry.monthlySpend}
                onChange={e => updateEntry(idx, 'monthlySpend', e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          </Card>
        ))}

        {/* ── Actions ────────────────────────────────────────────── */}
        {apiError && (
          <p className="text-xs text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">{apiError}</p>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <Button type="button" variant="secondary" size="sm" onClick={addEntry}>
            + Add Another Tool
          </Button>
          <Button type="submit" variant="primary" size="lg" loading={loading} className="flex-1">
            {loading ? 'Analysing your stack...' : 'Calculate My Savings →'}
          </Button>
        </div>

        <p className="text-xs text-center text-slate-600">
          Form data saves automatically. Come back anytime.
        </p>
      </form>
    </section>
  );
}
