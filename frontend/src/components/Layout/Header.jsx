import { useLocation } from 'react-router-dom';
import { Menu, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard',  subtitle: 'Your productivity at a glance' },
  '/tasks':     { title: 'My Tasks',   subtitle: 'Manage and track your work' },
  '/timelogs':  { title: 'Time Logs',  subtitle: 'All your tracked sessions' },
};

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const page = PAGE_TITLES[pathname] || { title: 'TaskFlow', subtitle: '' };

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-dark-700/50 bg-dark-900/80 backdrop-blur-sm flex-shrink-0 min-h-[60px]">
      {/* Left: hamburger + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="mobile-menu-btn"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-dark-400 hover:text-dark-100 hover:bg-dark-700/80 transition-all active:scale-95"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>

        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-dark-100 truncate leading-tight">
            {page.title}
          </h2>
          {page.subtitle && (
            <p className="text-xs text-dark-500 hidden sm:block truncate">{page.subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: date + actions + avatar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Date — hidden on xs */}
        <div className="hidden md:block text-right">
          <p className="text-xs font-semibold text-dark-300">
            {format(new Date(), 'EEE, MMM d')}
          </p>
          <p className="text-[10px] text-dark-600">{format(new Date(), 'yyyy')}</p>
        </div>

        {/* AI badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
          <Sparkles className="w-3 h-3 text-violet-400" strokeWidth={2} />
          <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wide">AI</span>
        </div>

        {/* Bell */}
        <button
          className="p-2 rounded-xl text-dark-400 hover:text-dark-100 hover:bg-dark-700/80 transition-all relative"
          aria-label="Notifications"
        >
          <Bell className="w-4.5 h-4.5" strokeWidth={1.75} />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow cursor-pointer ring-2 ring-transparent hover:ring-primary-500/40 transition-all">
          <span className="text-xs font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
}
