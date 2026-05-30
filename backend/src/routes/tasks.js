const express = require('express');
const { body, param } = require('express-validator');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(protect);

// ─── Validation ──────────────────────────────────────────────────────────────────
const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status value'),
  body('enhance')
    .optional()
    .isBoolean().withMessage('Enhance must be a boolean'),
];

const updateTaskValidation = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status value'),
];

// ─── Routes ──────────────────────────────────────────────────────────────────────
router.route('/')
  .get(getTasks)
  .post(createTaskValidation, createTask);

router.route('/:id')
  .get(param('id').isMongoId(), getTaskById)
  .put(updateTaskValidation, updateTask)
  .delete(param('id').isMongoId(), deleteTask);

module.exports = router;
