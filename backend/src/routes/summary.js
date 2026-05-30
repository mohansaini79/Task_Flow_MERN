const express = require('express');
const { getTodaySummary } = require('../controllers/summaryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/today', getTodaySummary);

module.exports = router;
