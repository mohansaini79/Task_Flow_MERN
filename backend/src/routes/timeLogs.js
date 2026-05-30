const express = require('express');
const { body } = require('express-validator');
const {
  startTimer,
  stopTimer,
  getTimeLogs,
  getRunningTimer,
} = require('../controllers/timeLogController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All timelog routes require authentication
router.use(protect);

// ─── Validation ──────────────────────────────────────────────────────────────────
const startTimerValidation = [
  body('taskId')
    .notEmpty().withMessage('Task ID is required')
    .isMongoId().withMessage('Invalid task ID'),
];

const stopTimerValidation = [
  body('taskId')
    .optional()
    .isMongoId().withMessage('Invalid task ID'),
  body('timeLogId')
    .optional()
    .isMongoId().withMessage('Invalid time log ID'),
];

// ─── Routes ──────────────────────────────────────────────────────────────────────
router.get('/', getTimeLogs);
router.get('/running', getRunningTimer);
router.post('/start', startTimerValidation, startTimer);
router.post('/stop', stopTimerValidation, stopTimer);

module.exports = router;
