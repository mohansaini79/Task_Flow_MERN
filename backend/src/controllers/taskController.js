const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const TimeLog = require('../models/TimeLog');
const { enhanceTask } = require('../services/aiService');
const { AppError } = require('../middleware/errorHandler');

/**
 * @desc    Get all tasks for the authenticated user
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const { status, sort = '-createdAt', page = 1, limit = 50 } = req.query;

    const filter = { userId: req.user._id };
    if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      Task.countDocuments(filter),
    ]);

    // Get running timer for each task
    const runningLogs = await TimeLog.find({
      userId: req.user._id,
      isRunning: true,
    }).lean();

    const runningTaskIds = new Set(runningLogs.map((log) => log.taskId.toString()));

    const tasksWithTimer = tasks.map((task) => ({
      ...task,
      isTimerRunning: runningTaskIds.has(task._id.toString()),
      activeLog: runningLogs.find((log) => log.taskId.toString() === task._id.toString()) || null,
    }));

    res.status(200).json({
      success: true,
      data: {
        tasks: tasksWithTimer,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task with optional AI enhancement
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { title, description, status, enhance = true } = req.body;

    let finalTitle = title.trim();
    let finalDescription = description ? description.trim() : '';
    let isAiEnhanced = false;
    let enhancementMethod = null;

    // Apply AI enhancement if no description is provided or enhance is explicitly true
    if (enhance && (!description || description.trim().length < 20)) {
      try {
        const enhanced = await enhanceTask(title);
        finalTitle = enhanced.title;
        finalDescription = enhanced.description;
        isAiEnhanced = true;
        enhancementMethod = enhanced.method;
      } catch (err) {
        // Proceed without enhancement
        console.warn('[Task] Enhancement failed, using raw input');
      }
    }

    const task = await Task.create({
      userId: req.user._id,
      originalInput: title,
      title: finalTitle,
      description: finalDescription,
      status: status || 'pending',
      isAiEnhanced,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: {
        task,
        enhanced: isAiEnhanced,
        enhancementMethod,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      throw new AppError('Task not found or you do not have permission to update it.', 404);
    }

    const { title, description, status } = req.body;
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task and its associated time logs
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      throw new AppError('Task not found or you do not have permission to delete it.', 404);
    }

    // Delete associated time logs
    await TimeLog.deleteMany({ taskId: task._id });

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task and associated time logs deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      throw new AppError('Task not found.', 404);
    }

    const timeLogs = await TimeLog.find({ taskId: task._id, userId: req.user._id })
      .sort('-startTime')
      .lean();

    res.status(200).json({
      success: true,
      data: { task, timeLogs },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getTaskById };
