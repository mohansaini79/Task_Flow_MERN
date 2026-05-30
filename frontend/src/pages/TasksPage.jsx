import { useState, useEffect, useCallback, useMemo } from 'react';
import { tasksAPI } from '../api/tasks';
import { timeLogsAPI } from '../api/timeLogs';
import toast from 'react-hot-toast';
import TaskCard from '../components/Tasks/TaskCard';
import TaskModal from '../components/Tasks/TaskModal';
import TaskFilter from '../components/Tasks/TaskFilter';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { Plus, ClipboardList, Sparkles } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [timerLoading, setTimerLoading] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  /* ── Fetch ── */
  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await tasksAPI.getAll();
      setTasks(data.data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  /* ── Create / Update ── */
  const handleSubmit = async (formData) => {
    setModalLoading(true);
    try {
      if (editTask) {
        const { data } = await tasksAPI.update(editTask._id, formData);
        setTasks((prev) => prev.map((t) => t._id === editTask._id ? { ...t, ...data.data.task } : t));
        toast.success('Task updated successfully');
      } else {
        const { data } = await tasksAPI.create(formData);
        const newTask = data.data.task;
        if (data.data.enhanced) {
          toast.success(
            `✨ Task AI-enhanced${data.data.enhancementMethod === 'gemini' ? ' with Gemini' : ''}!`,
            { duration: 5000 }
          );
        } else {
          toast.success('Task created successfully');
        }
        setTasks((prev) => [{ ...newTask, isTimerRunning: false, activeLog: null }, ...prev]);
      }
      setModalOpen(false);
      setEditTask(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setModalLoading(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = (taskId) => setDeleteConfirm(taskId);

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await tasksAPI.delete(deleteConfirm);
      setTasks((prev) => prev.filter((t) => t._id !== deleteConfirm));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setDeleteConfirm(null);
    }
  };

  /* ── Status ── */
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { data } = await tasksAPI.update(taskId, { status: newStatus });
      setTasks((prev) => prev.map((t) => t._id === taskId ? { ...t, status: data.data.task.status } : t));
      toast.success(`Moved to "${newStatus}"`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  /* ── Start Timer ── */
  const handleStartTimer = async (taskId) => {
    setTimerLoading(taskId);
    try {
      const { data } = await timeLogsAPI.start(taskId);
      const newLog = data.data.timeLog;
      const updatedTask = data.data.task;
      setTasks((prev) =>
        prev.map((t) => {
          if (t.isTimerRunning) return { ...t, isTimerRunning: false, activeLog: null };
          if (t._id === taskId) return { ...t, isTimerRunning: true, activeLog: newLog, status: updatedTask.status };
          return t;
        })
      );
      toast.success('Timer started!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start timer');
    } finally {
      setTimerLoading(null);
    }
  };

  /* ── Stop Timer ── */
  const handleStopTimer = async (taskId, timeLogId) => {
    setTimerLoading(taskId);
    try {
      const { data } = await timeLogsAPI.stop({ taskId, timeLogId });
      const updatedTask = data.data.task;
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId
            ? { ...t, isTimerRunning: false, activeLog: null, totalTimeSpent: updatedTask.totalTimeSpent }
            : t
        )
      );
      toast.success(`⏱ ${data.data.formattedDuration} logged`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to stop timer');
    } finally {
      setTimerLoading(null);
    }
  };

  /* ── Open modal ── */
  const handleEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const openCreate = () => { setEditTask(null); setModalOpen(true); };

  /* ── Filter ── */
  const filteredTasks = useMemo(() =>
    tasks.filter((t) => {
      const matchStatus = !statusFilter || t.status === statusFilter;
      const matchSearch = !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    }),
    [tasks, statusFilter, search]
  );

  const taskCounts = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }), [tasks]);

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-dark-100">My Tasks</h1>
          <p className="text-dark-500 text-xs sm:text-sm mt-0.5">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          id="create-task-btn"
          onClick={openCreate}
          className="btn-primary flex-shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>New Task</span>
        </button>
      </div>

      {/* ── Filter bar ── */}
      <TaskFilter
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        taskCounts={taskCounts}
      />

      {/* ── AI hint banner ── */}
      <div className="flex items-start sm:items-center gap-2.5 p-3 rounded-xl bg-gradient-to-r from-violet-500/5 to-primary-500/5 border border-violet-500/15">
        <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5 sm:mt-0" strokeWidth={2} />
        <p className="text-xs text-dark-400 leading-relaxed">
          <span className="text-violet-400 font-semibold">AI Powered</span> — Type something like{' '}
          <em className="text-dark-300 not-italic font-medium">"follow up with designer"</em>{' '}
          and AI generates a structured description automatically.
        </p>
      </div>

      {/* ── Task grid ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="xl" />
            <p className="text-dark-400 text-sm">Loading tasks...</p>
          </div>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onStartTimer={handleStartTimer}
              onStopTimer={handleStopTimer}
              timerLoading={timerLoading}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-dark-800/60 border border-dark-700/40 flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 sm:w-10 sm:h-10 text-dark-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-dark-300 mb-2">
            {search || statusFilter ? 'No tasks match your filters' : 'No tasks yet'}
          </h3>
          <p className="text-dark-500 text-xs sm:text-sm mb-5 max-w-xs leading-relaxed">
            {search || statusFilter
              ? 'Try adjusting your search or filter'
              : 'Create your first task and let AI enhance it for you'}
          </p>
          {!search && !statusFilter && (
            <button id="empty-create-task-btn" onClick={openCreate} className="btn-primary">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Create First Task
            </button>
          )}
        </div>
      )}

      {/* ── Delete confirmation ── */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div
            className="card p-5 sm:p-6 w-full max-w-sm mx-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
              <ClipboardList className="w-6 h-6 text-rose-400" strokeWidth={1.75} />
            </div>
            <h3 className="text-base font-bold text-dark-100 mb-1">Delete Task?</h3>
            <p className="text-dark-400 text-sm mb-5 leading-relaxed">
              This will permanently delete the task and all its time logs. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button id="cancel-delete-btn" onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button id="confirm-delete-btn" onClick={confirmDelete} className="btn-danger flex-1">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null); }}
        onSubmit={handleSubmit}
        editTask={editTask}
        loading={modalLoading}
      />
    </div>
  );
}
