// src/components/CTASection.jsx
// Bottom CTA strip on the landing page

export function CTASection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full bg-indigo-600/8 blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Free forever · No credit card needed
        </div>

        <h2 className="text-5xl font-extrabold text-white mb-5 leading-tight">
          Stop{' '}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
            guessing
          </span>
          {' '}what you owe.
        </h2>
        <p className="text-lg text-slate-400 mb-10 leading-relaxed">
          Your team's AI bill has hidden waste. In 30 seconds you'll know exactly what to cut, 
          downgrade, or switch — with specific dollar amounts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#audit"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-base shadow-xl shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-violet-500/40 w-full sm:w-auto text-center"
          >
            Audit My Stack for Free →
          </a>
          <p className="text-sm text-slate-500">Average savings: $1,200+ per year</p>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-12 flex-wrap">
          {[
            { icon: '🔒', text: 'No account required' },
            { icon: '⚡', text: 'Results in 30 seconds' },
            { icon: '🙈', text: 'No data sold' },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-1.5 text-slate-500 text-xs">
              <span>{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
