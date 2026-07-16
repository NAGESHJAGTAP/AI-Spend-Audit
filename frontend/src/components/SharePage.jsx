// src/components/SharePage.jsx
// Public Share Page — renders a full shareable audit result
// Hides email/company, injects Open Graph + Twitter Card meta tags dynamically

import { useEffect } from 'react';
import { Card, StatCard } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { useAuditContext } from '../context/AuditContext';
import { formatUSD, savingsPercent } from '../utils/formatCurrency';

function setMeta(property, content, isName = false) {
  const selector = isName
    ? `meta[name="${property}"]`
    : `meta[property="${property}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    if (isName) el.setAttribute('name', property);
    else el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function SharePage() {
  const { auditResult, goToForm } = useAuditContext();

  // Inject dynamic OG + Twitter Card tags when audit loads
  useEffect(() => {
    if (!auditResult) return;

    const savings = formatUSD(auditResult.totalAnnualSavings || 0);
    const title = `AI Spend Audit — Save ${savings}/yr on AI tools`;
    const desc = `This team could save ${savings} per year by optimizing their AI subscriptions. See the full breakdown.`;
    const url = window.location.href;

    // Title
    document.title = title;

    // Open Graph
    setMeta('og:title', title);
    setMeta('og:description', desc);
    setMeta('og:url', url);
    setMeta('og:type', 'website');
    setMeta('og:site_name', 'AI Spend Audit');

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image', true);
    setMeta('twitter:title', title, true);
    setMeta('twitter:description', desc, true);
    setMeta('twitter:site', '@aispendaudit', true);
  }, [auditResult]);

  if (!auditResult) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-14 h-14 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin mb-6" />
        <h2 className="text-xl font-bold text-white mb-2">Loading shared audit…</h2>
        <p className="text-slate-400 text-sm">Fetching savings report from the cloud.</p>
      </div>
    );
  }

  const {
    originalTotalSpend,
    recommendedTotalSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    toolBreakdown,
    aiSummary,
    shareId,
  } = auditResult;

  const pct = savingsPercent(originalTotalSpend, recommendedTotalSpend);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Share link copied!');
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
      {/* Shared-view banner */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 mb-8 text-center">
        <span className="inline-block text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">
          📊 Shared Audit Report
        </span>
        <p className="text-slate-400 text-sm">
          This is a public, anonymized snapshot. Email and company name are hidden.
        </p>
      </div>

      {/* Hero savings */}
      <div className="text-center mb-10">
        <p className="text-slate-400 text-sm mb-2 uppercase tracking-widest font-medium">
          AI Stack Audit Result
        </p>
        <h1 className="text-5xl font-extrabold text-white mb-2">
          Save{' '}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            {formatUSD(totalAnnualSavings)}
          </span>
          <span className="text-slate-400 text-3xl"> /yr</span>
        </h1>
        <p className="text-slate-400 mt-2">
          That's a{' '}
          <span className="text-emerald-400 font-semibold">{pct}% reduction</span>{' '}
          from the current{' '}
          <span className="text-white font-semibold">{formatUSD(originalTotalSpend)}/mo</span> spend.
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Current Monthly Spend"   value={formatUSD(originalTotalSpend)}   accent="amber" />
        <StatCard label="Optimized Monthly Spend" value={formatUSD(recommendedTotalSpend)} accent="green" />
        <StatCard label="Annual Savings"          value={formatUSD(totalAnnualSavings)}    sub={`${pct}% saved`} accent="violet" />
      </div>

      {/* Per-tool breakdown — email/company hidden */}
      <Card className="mb-6">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
          Per-Tool Breakdown
        </h3>
        <div className="flex flex-col gap-3">
          {toolBreakdown?.map((t, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-white/5 last:border-0 gap-4"
            >
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
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-500 line-through">
                  Current: {formatUSD(t.currentSpend)}/mo
                </p>
                <p className="text-sm text-emerald-400 font-semibold">
                  Recommended: {formatUSD(t.recommendedSpend)}/mo
                </p>
                {t.savings > 0 && (
                  <p className="text-xs text-violet-400 font-medium">
                    Saves: {formatUSD(t.savings)}/mo
                  </p>
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
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
              AI-Generated Insight
            </h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{aiSummary}</p>
        </Card>
      )}

      {/* CTA for visitors */}
      <div className="bg-gradient-to-br from-violet-950/80 via-slate-900 to-indigo-950/80 border border-violet-500/30 rounded-2xl p-8 text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          How much is YOUR team wasting?
        </h3>
        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
          Run your own free audit in 30 seconds. No signup required.
        </p>
        <Button variant="primary" size="lg" onClick={goToForm}>
          Audit My Stack for Free →
        </Button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="secondary" onClick={goToForm}>
          Create My Own Audit →
        </Button>
        <Button variant="ghost" onClick={handleCopy}>
          📋 Copy Share Link
        </Button>
      </div>
    </section>
  );
}
