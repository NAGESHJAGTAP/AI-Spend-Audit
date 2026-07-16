// src/components/AuditResults.jsx
// Displays the audit output: savings hero, per-tool breakdown, AI summary

import { Button } from './ui/Button';
import { Card, StatCard } from './ui/Card';
import { Badge } from './ui/Badge';
import { useAuditContext } from '../context/AuditContext';
import { formatUSD, savingsPercent } from '../utils/formatCurrency';

export function AuditResults() {
  const { auditResult, goToLead, goToForm, isSharedView } = useAuditContext();

  if (!auditResult) return null;

  const {
    originalTotalSpend,
    recommendedTotalSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    toolBreakdown,
    aiSummary,
    shareId,
    hasHighSavings,
    isAlreadyOptimal,
  } = auditResult;

  const pct = savingsPercent(originalTotalSpend, recommendedTotalSpend);
  const isWellSpent = isAlreadyOptimal || totalMonthlySavings < 100;

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const emailButtonText = isWellSpent
    ? 'Notify Me When New Optimizations Apply →'
    : 'Get Full Report by Email →';

  return (
    <section className="max-w-4xl mx-auto px-4 animate-fade-in-up">
      {/* Shared view banner */}
      {isSharedView && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 mb-8 text-center">
          <span className="inline-block text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">
            Shared Report View
          </span>
          <p className="text-slate-400 text-sm">
            This is a public, anonymized share of this AI spend audit. No identifying details are visible.
          </p>
        </div>
      )}

      {/* Hero savings banner */}
      <div className="text-center mb-10">
        <p className="text-slate-400 text-sm mb-2 uppercase tracking-widest font-medium">Your AI Stack Audit</p>
        <h2 className="text-5xl font-extrabold text-white mb-2">
          Save{' '}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            {formatUSD(totalAnnualSavings)}
          </span>
          <span className="text-slate-400 text-3xl"> /yr</span>
        </h2>
        <p className="text-slate-400 mt-2">
          That's a <span className="text-emerald-400 font-semibold">{pct}% reduction</span> from your current{' '}
          <span className="text-white font-semibold">{formatUSD(originalTotalSpend)}/mo</span> spend.
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Current Monthly Spend" value={formatUSD(originalTotalSpend)} accent="amber" />
        <StatCard label="Optimized Monthly Spend" value={formatUSD(recommendedTotalSpend)} accent="green" />
        <StatCard label="Annual Savings" value={formatUSD(totalAnnualSavings)} sub={`${pct}% saved`} accent="violet" />
      </div>

      {/* Honest stack notification if spending well */}
      {isWellSpent && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-emerald-400 text-xl font-bold">✓</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">You're spending well!</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            Your current subscription mix is already optimal for your team size and use case. 
            We do not manufacture artificial savings. You can subscribe below to get notified of new tools and plan updates.
          </p>
        </div>
      )}

      {/* Prominent Techvruk consultation if high savings (and not already optimal) */}
      {!isWellSpent && hasHighSavings && (
        <div className="bg-gradient-to-br from-violet-950/80 via-slate-900 to-indigo-950/80 border border-violet-500/30 rounded-2xl p-8 mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-violet-400/30 bg-violet-400/10 text-violet-300 text-xs font-semibold mb-3">
                💡 High-Savings Opportunity Detected
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Lock in {formatUSD(totalMonthlySavings)}/mo in savings
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                Implement these savings painlessly. Book a consultation with a Techvruk specialist to execute this plan, negotiate volume discounts, and set up credit pools.
              </p>
            </div>
            <a
              href="https://techvruk.com/consult"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors text-center shrink-0 shadow-lg shadow-violet-500/25"
            >
              Book Free Consultation →
            </a>
          </div>
        </div>
      )}

      {/* Per-tool breakdown */}
      <Card className="mb-6">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Per-Tool Breakdown</h3>
        <div className="flex flex-col gap-3">
          {toolBreakdown?.map((t, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-white/5 last:border-0 gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-white font-bold capitalize">{t.toolName}</span>
                  <Badge color={t.savings > 0 ? 'green' : 'slate'}>{t.currentPlan}</Badge>
                  {t.recommendedPlan && t.recommendedPlan !== t.currentPlan && (
                    <span className="text-xs text-violet-300 font-medium">
                      → Recommend: {t.recommendedPlan}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{t.reason}</p>
                {t.creditsNote && (
                  <p className="text-emerald-400 text-xs mt-2 bg-emerald-500/5 px-2.5 py-1.5 rounded-lg border border-emerald-500/10">
                    🎁 {t.creditsNote}
                  </p>
                )}
                {t.alternativeTool && (
                  <p className="text-violet-300 text-xs mt-2 bg-violet-500/5 px-2.5 py-1.5 rounded-lg border border-violet-500/10">
                    💡 **Cheaper Alternative**: Switch to **{t.alternativeTool.tool} ({t.alternativeTool.plan})** to save **{formatUSD(t.alternativeTool.estimatedSaving)}/mo**. {t.alternativeTool.note}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-500 line-through">Current: {formatUSD(t.currentSpend)}/mo</p>
                <p className="text-sm text-emerald-400 font-semibold">Recommended: {formatUSD(t.recommendedSpend)}/mo</p>
                {t.savings > 0 && (
                  <p className="text-xs text-violet-400 font-medium">Saves: {formatUSD(t.savings)}/mo</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Summary */}
      {aiSummary && (
        <Card glow className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-violet-500/30 flex items-center justify-center">
              <span className="text-xs text-violet-300">✦</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">AI-Generated Insight</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{aiSummary}</p>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center flex-wrap">
        {!isSharedView ? (
          <Button variant="primary" size="lg" onClick={goToLead}>
            {emailButtonText}
          </Button>
        ) : (
          <Button variant="primary" size="lg" onClick={goToForm}>
            Create Your Own Free Audit →
          </Button>
        )}
        <Button variant="secondary" size="lg" onClick={goToForm}>
          ← Start Over
        </Button>
        {shareId && (
          <Button variant="ghost" size="lg" onClick={handleCopyLink}>
            Share Results Link
          </Button>
        )}
      </div>
    </section>
  );
}
