const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const Click = require('../models/Click');

// Public stats for a short URL
router.get('/stats/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({
      $or: [{ shortCode }, { customAlias: shortCode.toLowerCase() }],
    }).lean();

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    // Get clicks per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const clicksPerDay = await Click.aggregate([
      {
        $match: {
          url: url._id,
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyClicks = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const found = clicksPerDay.find((c) => c._id === dateStr);
      dailyClicks.push({
        date: dateStr,
        clicks: found ? found.clicks : 0,
      });
    }

    // Top browsers (public)
    const topBrowsers = await Click.aggregate([
      { $match: { url: url._id } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const base = process.env.BASE_URL || 'http://localhost:5000';

    res.json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        shortUrl: `${base}/${url.customAlias || url.shortCode}`,
        shortCode: url.shortCode,
        totalClicks: url.totalClicks,
        lastClickedAt: url.lastClickedAt,
        createdAt: url.createdAt,
        dailyClicks,
        topBrowsers: topBrowsers.map((b) => ({ name: b._id || 'Unknown', count: b.count })),
      },
    });
  } catch (error) {
    console.error('Public stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
