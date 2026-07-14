// src/components/ui/Badge.jsx
// Small status/label badges

export function Badge({ children, color = 'violet' }) {
  const colors = {
    violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
    slate: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
}
