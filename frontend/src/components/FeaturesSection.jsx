// src/components/FeaturesSection.jsx
// How-it-works + feature highlights section for the landing page

export function FeaturesSection() {
  const steps = [
    {
      num: '01',
      icon: '📋',
      title: 'Enter Your Stack',
      desc: 'Add every AI tool your team pays for — tool name, plan, seats. Takes 60 seconds.',
    },
    {
      num: '02',
      icon: '⚡',
      title: 'Instant Audit',
      desc: 'Our engine cross-references pricing data, detects redundancies, and finds every missed saving.',
    },
    {
      num: '03',
      icon: '💸',
      title: 'Act on Savings',
      desc: 'Get a concrete action plan: what to cancel, downgrade, or switch — with exact dollar amounts.',
    },
  ];

  const features = [
    {
      icon: '🔍',
      title: 'Redundancy Detection',
      desc: 'Finds overlapping tools (e.g. Copilot + Cursor) that waste budget every single month.',
      accent: 'violet',
    },
    {
      icon: '📉',
      title: 'Plan Downgrades',
      desc: 'Spots overpowered plans for your team size — e.g. solo devs paying for Business tiers.',
      accent: 'indigo',
    },
    {
      icon: '🤖',
      title: 'AI-Generated Insight',
      desc: 'A 100-word AI summary explains the key savings opportunity in plain English.',
      accent: 'fuchsia',
    },
    {
      icon: '🔗',
      title: 'Shareable Reports',
      desc: 'Share your audit with your CFO or team via a public, anonymized link.',
      accent: 'sky',
    },
    {
      icon: '🔒',
      title: 'No Signup Required',
      desc: 'Zero account creation needed. Your data stays in your browser until you choose to share.',
      accent: 'emerald',
    },
    {
      icon: '🎯',
      title: 'Startup Credit Alerts',
      desc: 'Identifies if you qualify for $25k–$100k in free API credits from AWS, Google, or Microsoft.',
      accent: 'amber',
    },
  ];

  const accentMap = {
    violet:  { border: 'border-violet-500/20',  bg: 'bg-violet-500/10',  text: 'text-violet-300' },
    indigo:  { border: 'border-indigo-500/20',  bg: 'bg-indigo-500/10',  text: 'text-indigo-300' },
    fuchsia: { border: 'border-fuchsia-500/20', bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-300' },
    sky:     { border: 'border-sky-500/20',     bg: 'bg-sky-500/10',     text: 'text-sky-300' },
    emerald: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-300' },
    amber:   { border: 'border-amber-500/20',   bg: 'bg-amber-500/10',   text: 'text-amber-300' },
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* ── Section header ─────────────────────────────────── */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-block px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-4">
            How It Works
          </span>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            From confusion to clarity in{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              3 steps
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
            No spreadsheets. No consultants. Just paste your subscriptions and get a full savings report instantly.
          </p>
        </div>

        {/* ── Steps ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {steps.map((s) => (
            <div
              key={s.num}
              className="relative bg-white/[0.03] border border-white/8 rounded-2xl p-7 group hover:border-violet-500/30 hover:bg-white/[0.05] transition-all duration-300 animate-fade-in-up"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <span className="text-3xl">{s.icon}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-violet-400 tracking-widest uppercase mb-2 block">{s.num}</span>
                  <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
              {/* Connector line (hidden on last) */}
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-violet-500/30 last:hidden" />
            </div>
          ))}
        </div>

        {/* ── Features grid ──────────────────────────────────── */}
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="inline-block px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300 text-xs font-semibold uppercase tracking-widest mb-4">
            What We Analyze
          </span>
          <h2 className="text-3xl font-extrabold text-white mb-3">
            Every savings opportunity, surfaced automatically
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
            Our engine checks 11+ rules across pricing, seat counts, plan tiers, and tool overlaps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const a = accentMap[f.accent];
            return (
              <div
                key={f.title}
                className={`border ${a.border} bg-white/[0.02] rounded-xl p-5 group hover:${a.bg} transition-all duration-300 animate-fade-in-up`}
              >
                <div className={`w-10 h-10 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center mb-4 text-xl group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold text-base mb-1.5">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* ── Social proof numbers ───────────────────────────── */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-5 animate-fade-in-up">
          {[
            { stat: '$1,200+', label: 'Average annual savings' },
            { stat: '11+',     label: 'Optimization rules' },
            { stat: '9',       label: 'AI tools supported' },
            { stat: '30s',     label: 'Time to full audit' },
          ].map((s) => (
            <div
              key={s.stat}
              className="bg-white/[0.03] border border-white/8 rounded-xl p-5 text-center hover:border-violet-500/20 transition-colors"
            >
              <p className="text-3xl font-extrabold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-1">
                {s.stat}
              </p>
              <p className="text-slate-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
