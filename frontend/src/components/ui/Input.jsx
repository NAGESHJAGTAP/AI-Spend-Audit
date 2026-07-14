// src/components/ui/Input.jsx
// Reusable Input / Select components

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>}
      <input
        className={`
          bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white
          placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1
          focus:ring-violet-500 transition-colors w-full
          ${error ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Select({ label, error, options = [], placeholder = 'Select...', className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>}
      <select
        className={`
          bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white
          focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500
          transition-colors w-full appearance-none cursor-pointer
          ${error ? 'border-red-500/60' : ''}
          ${className}
        `}
        {...props}
      >
        <option value="" className="bg-slate-900">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
