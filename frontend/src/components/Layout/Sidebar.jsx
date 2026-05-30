import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  LogOut,
  Timer,
  X,
  CheckSquare2,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks',     icon: ClipboardList,   label: 'My Tasks' },
  { to: '/timelogs',  icon: Timer,           label: 'Time Logs' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-dark-950/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:static z-30 h-full w-64 flex-shrink-0
          bg-dark-900/98 backdrop-blur-xl border-r border-dark-700/50
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Sidebar navigation"
      >
        {/* ── Logo ── */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-dark-700/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow flex-shrink-0">
              <CheckSquare2 className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-dark-100 truncate">TaskFlow</h1>
              <p className="text-xs text-dark-500">AI Smart Tracker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-700 transition-colors flex-shrink-0"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
          <p className="px-3 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-3">
            Main Menu
          </p>

          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.75} />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Quick tip card */}
          <div className="pt-4">
            <p className="px-3 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-3">
              Tips
            </p>
            <div className="mx-1 px-3 py-3 rounded-xl bg-gradient-to-br from-primary-600/10 to-violet-600/10 border border-primary-500/15">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3.5 h-3.5 text-primary-400" strokeWidth={2} />
                <span className="text-xs font-semibold text-primary-300">AI Enhanced</span>
              </div>
              <p className="text-xs text-dark-500 leading-relaxed">
                Type a simple task — AI will generate a full description for you
              </p>
            </div>
          </div>
        </nav>

        {/* ── Timer hint ── */}
        <div className="px-4 py-3 mx-3 mb-3 rounded-xl bg-dark-800/60 border border-dark-700/40">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
            <span className="text-xs font-medium text-dark-300">Time Tracking</span>
          </div>
          <p className="text-[11px] text-dark-500 mt-0.5 ml-6">
            Start a timer on any task
          </p>
        </div>

        {/* ── User profile ── */}
        <div className="px-3 pb-4 border-t border-dark-700/50 pt-4 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-dark-800/60 border border-dark-700/30 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-xs font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-dark-100 truncate">{user?.name}</p>
              <p className="text-xs text-dark-500 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            id="logout-btn"
            onClick={handleLogout}
            className="nav-link w-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
          >
            <LogOut className="w-[18px] h-[18px]" strokeWidth={1.75} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
