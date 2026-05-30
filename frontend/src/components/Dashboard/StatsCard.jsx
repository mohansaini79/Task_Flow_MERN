export default function StatsCard({ title, value, subtitle, icon: Icon, color }) {
  const variants = {
    indigo:  { bg: 'bg-primary-500/10', icon: 'text-primary-400', ring: 'ring-primary-500/20' },
    emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', ring: 'ring-emerald-500/20' },
    amber:   { bg: 'bg-amber-500/10',   icon: 'text-amber-400',   ring: 'ring-amber-500/20'   },
    blue:    { bg: 'bg-blue-500/10',    icon: 'text-blue-400',    ring: 'ring-blue-500/20'    },
    rose:    { bg: 'bg-rose-500/10',    icon: 'text-rose-400',    ring: 'ring-rose-500/20'    },
    violet:  { bg: 'bg-violet-500/10',  icon: 'text-violet-400',  ring: 'ring-violet-500/20'  },
  };
  const c = variants[color] || variants.indigo;

  return (
    <div className="stat-card group animate-fade-in">
      {/* Icon container */}
      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className={`w-5 h-5 ${c.icon}`} strokeWidth={1.75} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] sm:text-xs font-semibold text-dark-500 uppercase tracking-wider mb-0.5 truncate">
          {title}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-dark-100 leading-none truncate">
          {value}
        </p>
        {subtitle && (
          <p className="text-[10px] text-dark-600 mt-0.5 truncate hidden sm:block">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
