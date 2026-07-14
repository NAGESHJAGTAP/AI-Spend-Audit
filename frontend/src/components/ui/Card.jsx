// src/components/ui/Card.jsx
// Glassmorphism card wrapper

export function Card({ children, className = '', glow = false }) {
  return (
    <div
      className={`
        bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6
        ${glow ? 'shadow-lg shadow-violet-500/10' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, sub, accent = 'violet' }) {
  const accents = {
    violet: 'text-violet-400',
    green: 'text-emerald-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
  };

  return (
    <Card glow>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-3xl font-bold ${accents[accent]}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </Card>
  );
}
