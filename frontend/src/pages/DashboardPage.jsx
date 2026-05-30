import { useState, useEffect, useCallback } from 'react';
import { summaryAPI } from '../api/summary';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/Dashboard/StatsCard';
import { useTimer } from '../hooks/useTimer';
import { formatDurationShort } from '../hooks/useTimer';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  RefreshCw,
  TrendingUp,
  Play,
  Activity,
  Timer,
} from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

/* ── Active Timer Widget ──────────────────────────────────────────────────────── */
function ActiveTimerWidget({ activeTimer }) {
  const { formatted } = useTimer(activeTimer?.startTime, !!activeTimer);
  if (!activeTimer) return null;

  return (
    <div className="card p-4 sm:p-5 border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
            <Play className="w-5 h-5 text-emerald-400" strokeWidth={2} fill="currentColor" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              ● Timer Running
            </p>
            <p className="text-sm font-semibold text-dark-100 mt-0.5 truncate max-w-[180px] sm:max-w-xs">
              {activeTimer.taskTitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 tracking-widest">
            {formatted}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Productivity Score Ring ─────────────────────────────────────────────────── */
function ProductivityRing({ score }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171';
  const label = score >= 70 ? '🔥 Excellent!' : score >= 40 ? '💪 Good progress' : '🚀 Get started';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative inline-flex items-center justify-center">
        <svg width="96" height="96" className="-rotate-90">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle
            cx="48" cy="48" r={radius} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-dark-100 leading-none">{score}</span>
          <span className="text-[9px] text-dark-500 uppercase tracking-wider mt-0.5">Score</span>
        </div>
      </div>
      <p className="text-xs text-dark-500 text-center">{label}</p>
    </div>
  );
}

/* ── Main Dashboard Page ─────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSummary = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const { data } = await summaryAPI.getToday();
      setSummary(data.data);
    } catch (err) {
      console.error('Failed to load summary:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(() => fetchSummary(true), 60000);
    return () => clearInterval(interval);
  }, [fetchSummary]);

  const s = summary?.summary;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner size="xl" />
          <p className="text-dark-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* ── Welcome header ── */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-dark-100">
            {greeting()},{' '}
            <span className="text-gradient">{user?.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-dark-500 text-xs sm:text-sm mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <button
          id="refresh-dashboard-btn"
          onClick={() => fetchSummary(true)}
          disabled={refreshing}
          className="btn-secondary btn-sm flex-shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} strokeWidth={2} />
          <span className="hidden xs:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* ── Active timer widget ── */}
      {s?.activeTimer && <ActiveTimerWidget activeTimer={s.activeTimer} />}

      {/* ── Stats grid — 2 cols mobile, 3 cols tablet, 6 cols desktop ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatsCard title="Total Tasks"    value={s?.totalTasks ?? 0}       subtitle="All time"              icon={ClipboardList}   color="indigo" />
        <StatsCard title="Pending"        value={s?.pendingTasks ?? 0}      subtitle="Need attention"        icon={AlertCircle}     color="amber" />
        <StatsCard title="In Progress"    value={s?.inProgressTasks ?? 0}   subtitle="Active"                icon={Zap}             color="blue" />
        <StatsCard title="Completed"      value={s?.completedTasks ?? 0}    subtitle="Done"                  icon={CheckCircle2}    color="emerald" />
        <StatsCard title="Worked Today"   value={s?.tasksWorkedOnToday ?? 0} subtitle="Tasks with time logged" icon={Activity}       color="violet" />
        <StatsCard title="Time Today"     value={s?.formattedTodayTime ?? '00:00:00'} subtitle="Total tracked" icon={Timer}        color="rose" />
      </div>

      {/* ── Bottom section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

        {/* Productivity score card */}
        <div className="card p-5 sm:p-6 flex flex-col items-center gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-primary-400" strokeWidth={2} />
              <h3 className="text-sm font-bold text-dark-100">Productivity Score</h3>
            </div>
            <p className="text-xs text-dark-500">Based on tasks & time tracked today</p>
          </div>

          <ProductivityRing score={s?.productivityScore ?? 0} />

          <div className="w-full">
            <div className="flex justify-between text-xs text-dark-500 mb-1.5">
              <span>Progress</span>
              <span className="font-semibold text-dark-300">{s?.productivityScore ?? 0}/100</span>
            </div>
            <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-violet-500 transition-all duration-1000"
                style={{ width: `${s?.productivityScore ?? 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="card p-5 sm:p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-dark-100">Recent Activity</h3>
              <p className="text-xs text-dark-500 mt-0.5">Today's time tracking sessions</p>
            </div>
            <Link
              to="/tasks"
              className="text-xs text-primary-400 hover:text-primary-300 font-semibold transition-colors"
            >
              View All →
            </Link>
          </div>

          {summary?.recentActivity?.length > 0 ? (
            <div className="space-y-2">
              {summary.recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-dark-700/30 border border-dark-700/30 hover:border-dark-600/50 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${activity.isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-dark-500'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-dark-200 truncate">{activity.taskTitle}</p>
                      <p className="text-[10px] text-dark-500 mt-0.5">
                        {format(new Date(activity.startTime), 'HH:mm')}
                        {activity.endTime && ` — ${format(new Date(activity.endTime), 'HH:mm')}`}
                        {activity.isRunning && ' · running'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono text-dark-400 flex-shrink-0">
                    <Clock className="w-3 h-3" strokeWidth={2} />
                    <span>{activity.isRunning ? 'live' : activity.formattedDuration}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-dark-700/60 flex items-center justify-center mb-3">
                <Clock className="w-7 h-7 text-dark-600" strokeWidth={1.5} />
              </div>
              <p className="text-dark-400 text-sm font-semibold">No activity yet today</p>
              <p className="text-dark-600 text-xs mt-1 mb-4">Start a timer on a task to track time</p>
              <Link to="/tasks" className="btn-primary btn-sm">
                Go to Tasks →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
