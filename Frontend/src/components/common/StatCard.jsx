export default function StatCard({ label, value, sub, icon: Icon, trend, color = 'sky', delay = 0 }) {
  const colors = {
    sky: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20', glow: 'hover:shadow-sky-500/10' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'hover:shadow-emerald-500/10' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', glow: 'hover:shadow-violet-500/10' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'hover:shadow-amber-500/10' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', glow: 'hover:shadow-red-500/10' },
  };
  const c = colors[color] || colors.sky;

  return (
    <div
      className={`glass rounded-2xl p-4 sm:p-6 border ${c.border} hover:scale-[1.02] transition-all duration-300 animate-slide-up card-3d hover:shadow-2xl ${c.glow}`}
      style={{ animationDelay: `${delay * 0.1}s`, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${c.bg} animate-glow-pulse transition-shadow duration-300`}>
          {Icon && <Icon size={20} className={c.text} />}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${trend >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold font-mono ${c.text}`}>{value}</p>
      {sub && <p className="text-slate-600 text-xs mt-1">{sub}</p>}
    </div>
  );
}
