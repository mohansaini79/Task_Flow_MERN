const Task = require('../models/Task');
const TimeLog = require('../models/TimeLog');

/**
 * @desc    Get today's productivity summary for the authenticated user
 * @route   GET /api/summary/today
 * @access  Private
 */
const getTodaySummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Define today's time range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Fetch all data in parallel for performance
    const [
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      todayTimeLogs,
      activeTimer,
    ] = await Promise.all([
      // Total tasks
      Task.countDocuments({ userId }),

      // Tasks by status
      Task.countDocuments({ userId, status: 'pending' }),
      Task.countDocuments({ userId, status: 'in-progress' }),
      Task.countDocuments({ userId, status: 'completed' }),

      // Today's time logs (completed)
      TimeLog.find({
        userId,
        startTime: { $gte: todayStart, $lte: todayEnd },
      })
        .populate('taskId', 'title status')
        .lean(),

      // Currently running timer
      TimeLog.findOne({ userId, isRunning: true })
        .populate('taskId', 'title status')
        .lean(),
    ]);

    // Calculate today's total time tracked (completed sessions)
    const completedTodayTime = todayTimeLogs
      .filter((log) => !log.isRunning)
      .reduce((sum, log) => sum + (log.duration || 0), 0);

    // Add live time for running timer
    let activeTimerDuration = 0;
    if (activeTimer) {
      activeTimerDuration = Math.floor((Date.now() - new Date(activeTimer.startTime)) / 1000);
    }

    const totalTodayTime = completedTodayTime + activeTimerDuration;

    // Tasks worked on today (unique task IDs from time logs)
    const tasksWorkedOnTodayIds = [...new Set(todayTimeLogs.map((log) => log.taskId?._id?.toString()))];
    const tasksWorkedOnToday = tasksWorkedOnTodayIds.length;

    // Recent activity (last 5 time logs today)
    const recentActivity = todayTimeLogs
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, 5)
      .map((log) => ({
        taskId: log.taskId?._id,
        taskTitle: log.taskId?.title || 'Unknown Task',
        startTime: log.startTime,
        endTime: log.endTime,
        duration: log.duration,
        formattedDuration: formatDuration(log.duration || 0),
        isRunning: log.isRunning,
      }));

    // Productivity score (simple heuristic: 0-100)
    const productivityScore = calculateProductivityScore({
      totalTasks,
      completedTasks,
      tasksWorkedOnToday,
      totalTodayTime,
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalTasks,
          pendingTasks,
          inProgressTasks,
          completedTasks,
          tasksWorkedOnToday,
          totalTodayTime, // in seconds
          formattedTodayTime: formatDuration(totalTodayTime),
          productivityScore,
          activeTimer: activeTimer
            ? {
                taskId: activeTimer.taskId?._id,
                taskTitle: activeTimer.taskId?.title,
                startTime: activeTimer.startTime,
                elapsed: activeTimerDuration,
              }
            : null,
        },
        recentActivity,
        date: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Helpers ────────────────────────────────────────────────────────────────────

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '00')}:${String(s).padStart(2, '00')}`;
};

const calculateProductivityScore = ({ totalTasks, completedTasks, tasksWorkedOnToday, totalTodayTime }) => {
  if (totalTasks === 0) return 0;

  // Completion rate (40% weight)
  const completionRate = (completedTasks / totalTasks) * 40;

  // Time tracked today (30% weight, max 4 hours = 14400 seconds)
  const timeScore = Math.min((totalTodayTime / 14400) * 30, 30);

  // Tasks worked on (30% weight, max 5 tasks)
  const activityScore = Math.min((tasksWorkedOnToday / 5) * 30, 30);

  return Math.round(completionRate + timeScore + activityScore);
};

module.exports = { getTodaySummary };
