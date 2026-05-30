const { validationResult } = require('express-validator');
const TimeLog = require('../models/TimeLog');
const Task = require('../models/Task');
const { AppError } = require('../middleware/errorHandler');

/**
 * @desc    Start a timer for a task
 * @route   POST /api/timelogs/start
 * @access  Private
 */
const startTimer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { taskId } = req.body;

    // Verify the task belongs to the user
    const task = await Task.findOne({ _id: taskId, userId: req.user._id });
    if (!task) {
      throw new AppError('Task not found or does not belong to you.', 404);
    }

    // Check if there's already a running timer for this task
    const existingLog = await TimeLog.findOne({
      taskId,
      userId: req.user._id,
      isRunning: true,
    });

    if (existingLog) {
      return res.status(409).json({
        success: false,
        message: 'A timer is already running for this task.',
        data: { timeLog: existingLog },
      });
    }

    // Check if user has any other running timers (stop them first)
    await TimeLog.updateMany(
      { userId: req.user._id, isRunning: true },
      {
        $set: {
          isRunning: false,
          endTime: new Date(),
        },
      }
    );

    // Recalculate duration for auto-stopped timers and update task totalTimeSpent
    const autoStoppedLogs = await TimeLog.find({
      userId: req.user._id,
      isRunning: false,
      endTime: { $exists: true },
      duration: 0,
    });

    for (const log of autoStoppedLogs) {
      const duration = Math.floor((log.endTime - log.startTime) / 1000);
      await TimeLog.findByIdAndUpdate(log._id, { duration });
      await Task.findByIdAndUpdate(log.taskId, { $inc: { totalTimeSpent: duration } });
    }

    // Update task status to in-progress if pending
    if (task.status === 'pending') {
      task.status = 'in-progress';
      await task.save();
    }

    // Create new time log
    const timeLog = await TimeLog.create({
      taskId,
      userId: req.user._id,
      startTime: new Date(),
      isRunning: true,
    });

    res.status(201).json({
      success: true,
      message: 'Timer started.',
      data: { timeLog, task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Stop a running timer
 * @route   POST /api/timelogs/stop
 * @access  Private
 */
const stopTimer = async (req, res, next) => {
  try {
    const { taskId, timeLogId } = req.body;

    let query = { userId: req.user._id, isRunning: true };
    if (timeLogId) query._id = timeLogId;
    if (taskId) query.taskId = taskId;

    const timeLog = await TimeLog.findOne(query);
    if (!timeLog) {
      throw new AppError('No running timer found for this task.', 404);
    }

    const endTime = new Date();
    const duration = Math.floor((endTime - timeLog.startTime) / 1000); // in seconds

    timeLog.endTime = endTime;
    timeLog.duration = duration;
    timeLog.isRunning = false;
    await timeLog.save();

    // Update task's total time spent
    await Task.findByIdAndUpdate(timeLog.taskId, {
      $inc: { totalTimeSpent: duration },
    });

    const updatedTask = await Task.findById(timeLog.taskId);

    res.status(200).json({
      success: true,
      message: 'Timer stopped.',
      data: {
        timeLog,
        duration,
        formattedDuration: formatDuration(duration),
        task: updatedTask,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all time logs for the authenticated user
 * @route   GET /api/timelogs
 * @access  Private
 */
const getTimeLogs = async (req, res, next) => {
  try {
    const { taskId, date, isRunning } = req.query;

    const filter = { userId: req.user._id };
    if (taskId) filter.taskId = taskId;
    if (isRunning !== undefined) filter.isRunning = isRunning === 'true';

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.startTime = { $gte: start, $lte: end };
    }

    const timeLogs = await TimeLog.find(filter)
      .populate('taskId', 'title status')
      .sort('-startTime')
      .lean();

    // Add formatted duration to each log
    const logsWithFormatted = timeLogs.map((log) => {
      let displayDuration = log.duration;
      if (log.isRunning) {
        displayDuration = Math.floor((Date.now() - new Date(log.startTime)) / 1000);
      }
      return {
        ...log,
        displayDuration,
        formattedDuration: formatDuration(displayDuration),
      };
    });

    res.status(200).json({
      success: true,
      data: { timeLogs: logsWithFormatted },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently running timer for user
 * @route   GET /api/timelogs/running
 * @access  Private
 */
const getRunningTimer = async (req, res, next) => {
  try {
    const runningLog = await TimeLog.findOne({
      userId: req.user._id,
      isRunning: true,
    }).populate('taskId', 'title status description');

    res.status(200).json({
      success: true,
      data: {
        runningLog: runningLog || null,
        isRunning: !!runningLog,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Utility ─────────────────────────────────────────────────────────────────────
const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

module.exports = { startTimer, stopTimer, getTimeLogs, getRunningTimer };
