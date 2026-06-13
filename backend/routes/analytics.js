const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// Dashboard summary
router.get('/dashboard/summary', auth, analyticsController.getDashboardSummary);

// URL analytics
router.get('/:urlId', auth, analyticsController.getUrlAnalytics);

// Recent clicks (paginated)
router.get('/:urlId/clicks', auth, analyticsController.getRecentClicks);

module.exports = router;
