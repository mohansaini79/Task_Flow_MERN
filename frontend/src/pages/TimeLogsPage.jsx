import { useState, useEffect, useCallback } from 'react';
import { timeLogsAPI } from '../api/timeLogs';
import { Clock, Play, Square, Calendar, Filter } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '00:00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

function getDayLabel(dateStr) {
  const d = new Date(dateStr);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'EEEE, MMM d, yyyy');
}

export default function TimeLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | running | completed

  const fetchLogs = useCallback(async () => {
    try {
      const { data } = await timeLogsAPI.getAll();
      setLogs(data.data.timeLogs || []);
    } catch {
      toast.error('Failed to load time logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Group by day
  const filtered = logs.filter((log) => {
    if (filter === 'running') return log.isRunning;
    if (filter === 'completed') return !log.isRunning;
    return true;
  });

  const grouped = filtered.reduce((acc, log) => {
    const day = format(new Date(log.startTime), 'yyyy-MM-dd');
    if (!acc[day]) acc[day] = [];
    acc[day].push(log);
    return acc;
  }, {});

  const sortedDays = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  // Totals
  const totalSeconds = logs
    .filter((l) => !l.isRunning && l.duration)
    .reduce((sum, l) => sum + l.duration, 0);

  const totalSessions = logs.length;
  const runningSessions = logs.filter((l) => l.isRunning).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-dark-100">Time Logs</h1>
          <p className="text-dark-500 text-xs sm:text-sm mt-0.5">
            All tracked sessions across your tasks
          </p>
        </div>
        {runningSessions > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">{runningSessions} timer running</span>
          </div>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center">
            <Clock className="w-4.5 h-4.5 text-primary-400" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-xs text-dark-500 font-medium">Total Tracked</p>
            <p className="text-lg font-bold text-dark-100 font-mono">{formatDuration(totalSeconds)}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <Calendar className="w-4.5 h-4.5 text-violet-400" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-xs text-dark-500 font-medium">Total Sessions</p>
            <p className="text-lg font-bold text-dark-100">{totalSessions}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Play className="w-4.5 h-4.5 text-emerald-400" strokeWidth={1.75} fill="currentColor" />
          </div>
          <div>
            <p className="text-xs text-dark-500 font-medium">Active Now</p>
            <p className="text-lg font-bold text-dark-100">{runningSessions}</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5">
        <Filter className="w-4 h-4 text-dark-500 flex-shrink-0" strokeWidth={2} />
        {[
          { key: 'all',       label: `All (${logs.length})` },
          { key: 'running',   label: `Running (${runningSessions})` },
          { key: 'completed', label: `Completed (${logs.length - runningSessions})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === key
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-dark-800 text-dark-400 hover:text-dark-200 border border-dark-700/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Log list grouped by day */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="xl" />
            <p className="text-dark-400 text-sm">Loading time logs...</p>
          </div>
        </div>
      ) : sortedDays.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-3xl bg-dark-800/60 border border-dark-700/40 flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-dark-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-bold text-dark-300 mb-2">No time logs yet</h3>
          <p className="text-dark-500 text-sm max-w-xs">
            Start a timer on any task to begin tracking your time
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedDays.map((day) => {
            const dayLogs = grouped[day];
            const dayTotal = dayLogs
              .filter((l) => !l.isRunning && l.duration)
              .reduce((sum, l) => sum + l.duration, 0);

            return (
              <div key={day}>
                {/* Day header */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-dark-200">{getDayLabel(day)}</span>
                    <span className="text-xs text-dark-600 bg-dark-800 border border-dark-700/40 rounded-full px-2 py-0.5">
                      {dayLogs.length} session{dayLogs.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {dayTotal > 0 && (
                    <span className="text-xs font-mono font-semibold text-dark-400">
                      {formatDuration(dayTotal)} total
                    </span>
                  )}
                </div>

                {/* Log entries */}
                <div className="space-y-2">
                  {dayLogs.map((log) => (
                    <div
                      key={log._id}
                      className="card p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4"
                    >
                      {/* Status dot */}
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        log.isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-dark-600'
                      }`} />

                      {/* Task name + time range */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark-100 truncate">
                          {log.taskId?.title || 'Unknown Task'}
                        </p>
                        <p className="text-xs text-dark-500 mt-0.5">
                          {format(new Date(log.startTime), 'HH:mm')}
                          {log.endTime
                            ? ` → ${format(new Date(log.endTime), 'HH:mm')}`
                            : ' → running...'}
                        </p>
                      </div>

                      {/* Duration badge */}
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg flex-shrink-0 ${
                        log.isRunning
                          ? 'bg-emerald-500/10 border border-emerald-500/25'
                          : 'bg-dark-700/60 border border-dark-700/40'
                      }`}>
                        {log.isRunning
                          ? <Play className="w-3 h-3 text-emerald-400" strokeWidth={2} fill="currentColor" />
                          : <Square className="w-3 h-3 text-dark-500" strokeWidth={2} />
                        }
                        <span className={`text-xs font-mono font-bold ${
                          log.isRunning ? 'text-emerald-400' : 'text-dark-400'
                        }`}>
                          {log.isRunning ? 'live' : formatDuration(log.duration)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
