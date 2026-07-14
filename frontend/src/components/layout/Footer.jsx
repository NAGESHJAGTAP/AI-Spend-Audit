// src/components/layout/Footer.jsx

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950 py-10 mt-24">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} AI Spend Audit. Built for TechVruk Round 1.</p>
        <div className="flex items-center gap-5">
          <a href="https://github.com/NAGESHJAGTAP/AI-Spend-Audit" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            GitHub
          </a>
          <a href="#audit" className="hover:text-white transition-colors">Start Audit</a>
        </div>
      </div>
    </footer>
  );
}
