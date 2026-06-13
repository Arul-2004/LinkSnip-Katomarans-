const mongoose = require('mongoose');
const Url = require('../models/Url');
const Click = require('../models/Click');

// Get analytics for a specific URL
exports.getUrlAnalytics = async (req, res, next) => {
  try {
    const url = await Url.findOne({
      _id: req.params.urlId,
      user: req.user.id,
    });

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
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days with 0 clicks
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

    // Top browsers
    const topBrowsers = await Click.aggregate([
      { $match: { url: url._id } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Top OS
    const topOS = await Click.aggregate([
      { $match: { url: url._id } },
      { $group: { _id: '$os', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Top devices
    const topDevices = await Click.aggregate([
      { $match: { url: url._id } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Top countries
    const topCountries = await Click.aggregate([
      { $match: { url: url._id } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Top cities
    const topCities = await Click.aggregate([
      { $match: { url: url._id } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Top referrers
    const topReferrers = await Click.aggregate([
      { $match: { url: url._id } },
      { $group: { _id: '$referer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Recent clicks
    const recentClicks = await Click.find({ url: url._id })
      .sort({ timestamp: -1 })
      .limit(20)
      .lean();

    const base = process.env.BASE_URL || 'http://localhost:5000';

    res.json({
      success: true,
      data: {
        url: {
          id: url._id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          customAlias: url.customAlias,
          shortUrl: `${base}/${url.customAlias || url.shortCode}`,
          title: url.title,
          totalClicks: url.totalClicks,
          lastClickedAt: url.lastClickedAt,
          createdAt: url.createdAt,
        },
        analytics: {
          dailyClicks,
          topBrowsers: topBrowsers.map((b) => ({ name: b._id || 'Unknown', count: b.count })),
          topOS: topOS.map((o) => ({ name: o._id || 'Unknown', count: o.count })),
          topDevices: topDevices.map((d) => ({ name: d._id || 'Unknown', count: d.count })),
          topCountries: topCountries.map((c) => ({ name: c._id || 'Unknown', count: c.count })),
          topCities: topCities.map((c) => ({ name: c._id || 'Unknown', count: c.count })),
          topReferrers: topReferrers.map((r) => ({ name: r._id || 'Direct', count: r.count })),
          recentClicks,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get recent clicks for a URL (paginated)
exports.getRecentClicks = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const url = await Url.findOne({
      _id: req.params.urlId,
      user: req.user.id,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    const total = await Click.countDocuments({ url: url._id });
    const clicks = await Click.find({ url: url._id })
      .sort({ timestamp: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: {
        clicks,
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

// Dashboard summary
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Total links
    const totalLinks = await Url.countDocuments({ user: userId });

    // Total clicks
    const totalClicksAgg = await Url.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$totalClicks' } } },
    ]);
    const totalClicks = totalClicksAgg.length > 0 ? totalClicksAgg[0].total : 0;

    // Links created today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const linksToday = await Url.countDocuments({
      user: userId,
      createdAt: { $gte: startOfDay },
    });

    // Top performing link
    const topLink = await Url.findOne({ user: userId })
      .sort({ totalClicks: -1 })
      .lean();

    const base = process.env.BASE_URL || 'http://localhost:5000';

    // Clicks per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const userUrls = await Url.find({ user: userId }).select('_id');
    const urlIds = userUrls.map((u) => u._id);

    const weeklyClicks = await Click.aggregate([
      {
        $match: {
          url: { $in: urlIds },
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing days
    const dailyClicks = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const found = weeklyClicks.find((c) => c._id === dateStr);
      dailyClicks.push({
        date: dateStr,
        clicks: found ? found.clicks : 0,
      });
    }

    // Recent links
    const recentLinks = await Url.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentLinksWithUrl = recentLinks.map((link) => ({
      ...link,
      id: link._id,
      shortUrl: `${base}/${link.customAlias || link.shortCode}`,
    }));

    res.json({
      success: true,
      data: {
        totalLinks,
        totalClicks,
        linksToday,
        topLink: topLink
          ? {
              ...topLink,
              id: topLink._id,
              shortUrl: `${base}/${topLink.customAlias || topLink.shortCode}`,
            }
          : null,
        dailyClicks,
        recentLinks: recentLinksWithUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
