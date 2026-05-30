import { useState, useEffect } from 'react';
import { X, Sparkles, Lightbulb } from 'lucide-react';
import LoadingSpinner from '../UI/LoadingSpinner';

const STATUS_OPTIONS = [
  { value: 'pending',     label: '⏳ Pending' },
  { value: 'in-progress', label: '🔄 In Progress' },
  { value: 'completed',   label: '✅ Completed' },
];

export default function TaskModal({ isOpen, onClose, onSubmit, editTask, loading }) {
  const isEditing = !!editTask;

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    enhance: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        description: editTask.description || '',
        status: editTask.status || 'pending',
        enhance: false,
      });
    } else {
      setForm({ title: '', description: '', status: 'pending', enhance: true });
    }
    setErrors({});
  }, [editTask, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.trim().length < 2) e.title = 'Title must be at least 2 characters';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSubmit(form);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg mx-auto animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="card max-h-[92vh] flex flex-col">
          {/* ── Header ── */}
          <div className="flex items-start justify-between p-5 sm:p-6 border-b border-dark-700/50 flex-shrink-0">
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-dark-100">
                {isEditing ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="text-xs text-dark-500 mt-0.5">
                {isEditing
                  ? 'Update task details below'
                  : 'AI will enhance your task automatically'}
              </p>
            </div>
            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-dark-400 hover:text-dark-100 hover:bg-dark-700 transition-colors flex-shrink-0 ml-3"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Title */}
            <div>
              <label htmlFor="task-title" className="label">
                Task Title <span className="text-rose-400">*</span>
              </label>
              <input
                id="task-title"
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder='e.g., "follow up with designer"'
                className={`input ${errors.title ? 'input-error' : ''}`}
                autoFocus
              />
              {errors.title && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-rose-400 inline-block" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="task-description" className="label">
                Description
                <span className="ml-1.5 text-dark-600 font-normal text-xs">(optional)</span>
              </label>
              <textarea
                id="task-description"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Add context or details about this task..."
                rows={3}
                className="input resize-none"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="task-status" className="label">Status</label>
              <select
                id="task-status"
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="input"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Enhancement toggle */}
            {!isEditing && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/5 to-primary-500/5 border border-violet-500/20">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-violet-400" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark-200">AI Enhancement</p>
                      <p className="text-xs text-dark-500 mt-0.5 leading-relaxed">
                        Generates professional title & structured description from your input
                      </p>
                    </div>
                  </div>

                  {/* Toggle switch */}
                  <button
                    type="button"
                    id="ai-toggle-btn"
                    onClick={() => handleChange('enhance', !form.enhance)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-dark-900 flex-shrink-0
                      ${form.enhance ? 'bg-violet-600' : 'bg-dark-600'}`}
                    role="switch"
                    aria-checked={form.enhance}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200
                        ${form.enhance ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                {form.enhance && (
                  <div className="flex items-center gap-1.5 mt-3 ml-11">
                    <Lightbulb className="w-3 h-3 text-amber-400" strokeWidth={2} />
                    <p className="text-[11px] text-amber-400/80">
                      AI will analyze your task and generate a structured action plan
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                id="cancel-task-btn"
                onClick={onClose}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-task-btn"
                className="btn-primary flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="truncate">
                      {isEditing ? 'Saving...' : form.enhance ? 'Enhancing...' : 'Creating...'}
                    </span>
                  </>
                ) : (
                  <>
                    {!isEditing && form.enhance && <Sparkles className="w-4 h-4 flex-shrink-0" strokeWidth={2} />}
                    <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
