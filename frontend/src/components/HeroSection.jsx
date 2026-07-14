// src/components/HeroSection.jsx
// Landing hero with headline, sub, and CTA

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
        Free AI Spend Audit · No signup required
      </div>

      {/* Headline */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-white max-w-3xl leading-tight mb-5">
        Your team is{' '}
        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
          overpaying
        </span>{' '}
        for AI tools.
      </h1>

      <p className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
        AI Spend Audit analyzes every subscription in your stack and finds the exact savings —
        overlapping features, unused seats, and cheaper tiers you're missing.
      </p>

      <a
        href="#audit"
        className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-base shadow-xl shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-violet-500/40"
      >
        Audit My Stack for Free →
      </a>

      <p className="text-xs text-slate-600 mt-4">Average user saves $1,200+ per year.</p>

      {/* Social proof strip */}
      <div className="flex items-center gap-6 mt-16 text-slate-500 text-sm flex-wrap justify-center">
        {['ChatGPT', 'Copilot', 'Claude', 'Midjourney', 'Notion AI', 'Gemini'].map((tool) => (
          <span key={tool} className="opacity-60">{tool}</span>
        ))}
      </div>
    </section>
  );
}
