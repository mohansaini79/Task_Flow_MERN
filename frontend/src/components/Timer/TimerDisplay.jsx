import { Play, Square } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';
import LoadingSpinner from '../UI/LoadingSpinner';

export default function TimerDisplay({ task, activeLog, onStart, onStop, loading }) {
  const isRunning = !!activeLog;
  const { formatted } = useTimer(activeLog?.startTime, isRunning);

  return (
    <div className="flex items-center gap-1.5">
      {/* Live timer */}
      {isRunning && (
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-2 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span className="font-mono text-xs font-bold tracking-wider text-emerald-400">
            {formatted}
          </span>
        </div>
      )}

      {/* Control button */}
      {loading ? (
        <button
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-dark-700 border border-dark-600 text-dark-400 text-xs font-medium cursor-not-allowed"
          disabled
        >
          <LoadingSpinner size="sm" />
        </button>
      ) : isRunning ? (
        <button
          id={`stop-timer-${task._id}`}
          onClick={() => onStop(task._id, activeLog._id)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/25 text-xs font-semibold transition-all active:scale-95"
          title="Stop timer"
        >
          <Square className="w-3 h-3" strokeWidth={2.5} fill="currentColor" />
          <span>Stop</span>
        </button>
      ) : (
        <button
          id={`start-timer-${task._id}`}
          onClick={() => onStart(task._id)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/25 text-xs font-semibold transition-all active:scale-95"
          title="Start timer"
        >
          <Play className="w-3 h-3" strokeWidth={2.5} fill="currentColor" />
          <span>Start</span>
        </button>
      )}
    </div>
  );
}
