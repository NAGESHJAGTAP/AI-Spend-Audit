// src/components/AuditResults.jsx
// Displays the audit output: savings hero, per-tool breakdown, AI summary

import { Button } from './ui/Button';
import { Card, StatCard } from './ui/Card';
import { Badge } from './ui/Badge';
import { useAuditContext } from '../context/AuditContext';
import { formatUSD, savingsPercent } from '../utils/formatCurrency';

export function AuditResults() {
  const { auditResult, goToLead, goToForm } = useAuditContext();

  if (!auditResult) return null;

  const { totalCurrentSpend, totalOptimizedSpend, totalSavings, tools, summary, shareId } = auditResult;
  const pct = savingsPercent(totalCurrentSpend, totalOptimizedSpend);

  return (
    <section className="max-w-4xl mx-auto px-4">
      {/* Hero savings banner */}
      <div className="text-center mb-10">
        <p className="text-slate-400 text-sm mb-2 uppercase tracking-widest font-medium">Your AI Stack Audit</p>
        <h2 className="text-5xl font-extrabold text-white mb-2">
          Save{' '}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            {formatUSD(totalSavings)}
          </span>
          <span className="text-slate-400 text-3xl"> /yr</span>
        </h2>
        <p className="text-slate-400 mt-2">
          That's a <span className="text-emerald-400 font-semibold">{pct}% reduction</span> from your current{' '}
          <span className="text-white font-semibold">{formatUSD(totalCurrentSpend)}/mo</span> spend.
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Current Monthly Spend" value={formatUSD(totalCurrentSpend)} accent="amber" />
        <StatCard label="Optimized Monthly Spend" value={formatUSD(totalOptimizedSpend)} accent="green" />
        <StatCard label="Annual Savings" value={formatUSD(totalSavings)} sub={`${pct}% saved`} accent="violet" />
      </div>

      {/* Per-tool breakdown */}
      <Card className="mb-6">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Per-Tool Breakdown</h3>
        <div className="flex flex-col gap-3">
          {tools?.map((t, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-white font-medium capitalize">{t.tool}</span>
                <Badge color={t.savings > 0 ? 'green' : 'slate'}>{t.tier}</Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 line-through">{formatUSD(t.currentSpend)}/mo</p>
                <p className="text-sm text-emerald-400 font-semibold">{formatUSD(t.optimizedSpend)}/mo</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Summary */}
      {summary && (
        <Card glow className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-violet-500/30 flex items-center justify-center">
              <span className="text-xs text-violet-300">✦</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">AI-Generated Insight</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{summary}</p>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="primary" size="lg" onClick={goToLead}>
          Get Full Report by Email →
        </Button>
        <Button variant="secondary" size="lg" onClick={goToForm}>
          ← Start Over
        </Button>
        {shareId && (
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/share/${shareId}`);
              alert('Share link copied!');
            }}
          >
            Share Results
          </Button>
        )}
      </div>
    </section>
  );
}
