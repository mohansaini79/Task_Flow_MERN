import { Pencil, Trash2, Clock, Sparkles } from 'lucide-react';
import { formatDurationShort } from '../../hooks/useTimer';
import TimerDisplay from '../Timer/TimerDisplay';
import { format } from 'date-fns';

const STATUS_LABELS = {
  pending:     { label: 'Pending',     cls: 'badge-pending' },
  'in-progress': { label: 'In Progress', cls: 'badge-in-progress' },
  completed:   { label: 'Completed',   cls: 'badge-completed' },
};

const STATUS_OPTIONS = [
  { value: 'pending',     label: '⏳ Pending' },
  { value: 'in-progress', label: '🔄 In Progress' },
  { value: 'completed',   label: '✅ Completed' },
];

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onStartTimer,
  onStopTimer,
  timerLoading,
}) {
  const status = STATUS_LABELS[task.status] || STATUS_LABELS.pending;

  return (
    <div className="card-hover p-4 sm:p-5 animate-fade-in flex flex-col gap-3">
      {/* ── Top row: title + actions ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <h3 className="text-sm font-semibold text-dark-100 leading-snug line-clamp-2">
              {task.title}
            </h3>
            {task.isAiEnhanced && (
              <span
                title="AI Enhanced"
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-400 bg-violet-400/10 border border-violet-400/20 rounded-full px-1.5 py-0.5 flex-shrink-0"
              >
                <Sparkles className="w-2.5 h-2.5" strokeWidth={2} />
                AI
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-dark-400 line-clamp-2 leading-relaxed">
              {task.description.replace(/\*\*/g, '').replace(/#+\s/g, '')}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            id={`edit-task-${task._id}`}
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-dark-500 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
            title="Edit task"
          >
            <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
          <button
            id={`delete-task-${task._id}`}
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-lg text-dark-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ── Middle: status + time ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status badge with dropdown */}
        <div className="relative group">
          <button className={`${status.cls} cursor-pointer select-none`}>
            {status.label}
          </button>
          <div className="absolute top-full left-0 mt-1.5 z-20 hidden group-hover:block group-focus-within:block">
            <div className="bg-dark-800 border border-dark-600/80 rounded-xl shadow-2xl overflow-hidden min-w-[140px] backdrop-blur-sm">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  id={`status-${opt.value}-${task._id}`}
                  onClick={() => onStatusChange(task._id, opt.value)}
                  className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors
                    ${task.status === opt.value
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'text-dark-300 hover:bg-dark-700/80'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Time spent */}
        {task.totalTimeSpent > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-dark-500 bg-dark-700/40 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" strokeWidth={2} />
            <span className="font-medium">{formatDurationShort(task.totalTimeSpent)}</span>
          </div>
        )}
      </div>

      {/* ── Bottom: timer + date ── */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-dark-700/40">
        <p className="text-[10px] text-dark-600">
          {format(new Date(task.createdAt), 'MMM d, yyyy')}
        </p>
        <TimerDisplay
          task={task}
          activeLog={task.isTimerRunning ? task.activeLog : null}
          onStart={onStartTimer}
          onStop={onStopTimer}
          loading={timerLoading === task._id}
        />
      </div>
    </div>
  );
}
