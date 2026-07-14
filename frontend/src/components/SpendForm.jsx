// src/components/SpendForm.jsx
// Multi-step spend entry form with local storage persistence

import { useState } from 'react';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';
import { Card } from './ui/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAudit } from '../hooks/useAudit';
import { useAuditContext } from '../context/AuditContext';
import { TOOLS, TIERS, DEFAULT_TOOL_ENTRY, LS_FORM_KEY } from '../utils/constants';
import { validateSpendEntry } from '../utils/validators';

export function SpendForm() {
  const [entries, setEntries] = useLocalStorage(LS_FORM_KEY, [{ ...DEFAULT_TOOL_ENTRY }]);
  const [errors, setErrors] = useState([{}]);
  const { runAudit, loading } = useAudit();
  const { goToResults } = useAuditContext();

  const addEntry = () => {
    setEntries((prev) => [...prev, { ...DEFAULT_TOOL_ENTRY }]);
    setErrors((prev) => [...prev, {}]);
  };

  const removeEntry = (idx) => {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
    setErrors((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateEntry = (idx, field, value) => {
    setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all entries
    const allErrors = entries.map(validateSpendEntry);
    setErrors(allErrors.map((r) => r.errors));
    if (allErrors.some((r) => !r.valid)) return;

    const result = await runAudit({ tools: entries });
    if (result) goToResults(result, entries);
  };

  return (
    <section id="audit" className="max-w-3xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">Audit Your AI Stack</h2>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          Add every AI tool your team pays for. We'll calculate exact savings in 30 seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {entries.map((entry, idx) => (
          <Card key={idx} glow>
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
                options={TOOLS}
                placeholder="Select tool..."
                value={entry.tool}
                onChange={(e) => updateEntry(idx, 'tool', e.target.value)}
                error={errors[idx]?.tool}
              />
              <Select
                label="Pricing Tier"
                options={TIERS}
                placeholder="Select tier..."
                value={entry.tier}
                onChange={(e) => updateEntry(idx, 'tier', e.target.value)}
                error={errors[idx]?.tier}
              />
              <Input
                label="Seats / Licenses"
                type="number"
                min="1"
                placeholder="e.g. 5"
                value={entry.seats}
                onChange={(e) => updateEntry(idx, 'seats', Number(e.target.value))}
                error={errors[idx]?.seats}
              />
              <Input
                label="Monthly Spend (USD)"
                type="number"
                min="0"
                placeholder="Leave blank to auto-calculate"
                value={entry.monthlySpend}
                onChange={(e) => updateEntry(idx, 'monthlySpend', e.target.value ? Number(e.target.value) : '')}
                error={errors[idx]?.monthlySpend}
              />
            </div>
          </Card>
        ))}

        <div className="flex items-center gap-3 mt-2">
          <Button type="button" variant="secondary" size="sm" onClick={addEntry}>
            + Add Another Tool
          </Button>
          <Button type="submit" variant="primary" size="lg" loading={loading} className="flex-1">
            {loading ? 'Analyzing your stack...' : 'Calculate My Savings →'}
          </Button>
        </div>
      </form>
    </section>
  );
}
