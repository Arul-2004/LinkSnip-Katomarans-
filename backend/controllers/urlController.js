const Url = require('../models/Url');
const Click = require('../models/Click');
const generateCode = require('../utils/generateCode');
const generateQR = require('../utils/generateQR');
const { parse } = require('csv-parse/sync');

// Create short URL
exports.createUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, title, expiresAt } = req.body;

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid URL (include http:// or https://)',
      });
    }

    // Check custom alias availability
    if (customAlias) {
      const aliasRegex = /^[a-zA-Z0-9_-]+$/;
      if (!aliasRegex.test(customAlias)) {
        return res.status(400).json({
          success: false,
          message: 'Custom alias can only contain letters, numbers, hyphens, and underscores',
        });
      }

      if (customAlias.length < 3 || customAlias.length > 30) {
        return res.status(400).json({
          success: false,
          message: 'Custom alias must be between 3 and 30 characters',
        });
      }

      const existingAlias = await Url.findOne({
        $or: [
          { customAlias: customAlias.toLowerCase() },
          { shortCode: customAlias.toLowerCase() },
        ],
      });

      if (existingAlias) {
        return res.status(409).json({
          success: false,
          message: 'This custom alias is already taken',
        });
      }
    }

    // Generate short code
    const shortCode = await generateCode();

    // Build short URL for QR
    const base = process.env.BASE_URL || 'http://localhost:5000';
    const shortUrl = `${base}/${customAlias || shortCode}`;

    // Generate QR code
    const qrCode = await generateQR(shortUrl);

    // Create URL document
    const url = await Url.create({
      originalUrl,
      shortCode,
      customAlias: customAlias ? customAlias.toLowerCase() : undefined,
      user: req.user.id,
      title: title || '',
      qrCode: qrCode || '',
      expiresAt: expiresAt || null,
    });

    res.status(201).json({
      success: true,
      message: 'Short URL created successfully',
      data: {
        url: {
          id: url._id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          customAlias: url.customAlias,
          shortUrl,
          title: url.title,
          qrCode: url.qrCode,
          expiresAt: url.expiresAt,
          totalClicks: url.totalClicks,
          createdAt: url.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all URLs for user
exports.getUrls = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      sort = '-createdAt',
    } = req.query;

    const query = { user: req.user.id };

    // Search filter
    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } },
        { customAlias: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Url.countDocuments(query);
    const urls = await Url.find(query)
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    // Add shortUrl to each
    const base = process.env.BASE_URL || 'http://localhost:5000';
    const urlsWithShortUrl = urls.map((url) => ({
      ...url,
      id: url._id,
      shortUrl: `${base}/${url.customAlias || url.shortCode}`,
    }));

    res.json({
      success: true,
      data: {
        urls: urlsWithShortUrl,
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

// Get single URL
exports.getUrl = async (req, res, next) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).lean();

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    const base = process.env.BASE_URL || 'http://localhost:5000';

    res.json({
      success: true,
      data: {
        url: {
          ...url,
          id: url._id,
          shortUrl: `${base}/${url.customAlias || url.shortCode}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update URL
exports.updateUrl = async (req, res, next) => {
  try {
    const { originalUrl, title, expiresAt } = req.body;

    const url = await Url.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    // Validate new URL if provided
    if (originalUrl) {
      try {
        new URL(originalUrl);
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid URL',
        });
      }
      url.originalUrl = originalUrl;
    }

    if (title !== undefined) url.title = title;
    if (expiresAt !== undefined) url.expiresAt = expiresAt;

    await url.save();

    const base = process.env.BASE_URL || 'http://localhost:5000';

    res.json({
      success: true,
      message: 'URL updated successfully',
      data: {
        url: {
          id: url._id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          customAlias: url.customAlias,
          shortUrl: `${base}/${url.customAlias || url.shortCode}`,
          title: url.title,
          qrCode: url.qrCode,
          expiresAt: url.expiresAt,
          totalClicks: url.totalClicks,
          createdAt: url.createdAt,
          updatedAt: url.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete URL
exports.deleteUrl = async (req, res, next) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    // Delete associated clicks
    await Click.deleteMany({ url: url._id });

    // Delete the URL
    await Url.deleteOne({ _id: url._id });

    res.json({
      success: true,
      message: 'URL deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Bulk create URLs from CSV
exports.bulkCreate = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a CSV file',
      });
    }

    const csvContent = req.file.buffer.toString('utf-8');
    let records;

    try {
      records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid CSV format. Please check your file.',
      });
    }

    if (records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'CSV file is empty',
      });
    }

    if (records.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 100 URLs allowed per bulk upload',
      });
    }

    const base = process.env.BASE_URL || 'http://localhost:5000';
    const results = [];

    for (const record of records) {
      const url = record.url || record.URL || record.originalUrl || record.link;

      if (!url) {
        results.push({
          url: 'N/A',
          status: 'error',
          message: 'No URL found in row',
        });
        continue;
      }

      try {
        new URL(url);
      } catch {
        results.push({
          url,
          status: 'error',
          message: 'Invalid URL format',
        });
        continue;
      }

      try {
        const shortCode = await generateCode();
        const alias = record.alias || record.customAlias;
        const shortUrl = `${base}/${alias || shortCode}`;
        const qrCode = await generateQR(shortUrl);

        const newUrl = await Url.create({
          originalUrl: url,
          shortCode,
          customAlias: alias ? alias.toLowerCase() : undefined,
          user: req.user.id,
          title: record.title || '',
          qrCode: qrCode || '',
        });

        results.push({
          url,
          shortUrl,
          shortCode: newUrl.shortCode,
          status: 'success',
          message: 'Created successfully',
        });
      } catch (error) {
        results.push({
          url,
          status: 'error',
          message: error.code === 11000 ? 'Alias already taken' : error.message,
        });
      }
    }

    const successCount = results.filter((r) => r.status === 'success').length;
    const errorCount = results.filter((r) => r.status === 'error').length;

    res.status(201).json({
      success: true,
      message: `Bulk upload complete: ${successCount} created, ${errorCount} failed`,
      data: { results, successCount, errorCount },
    });
  } catch (error) {
    next(error);
  }
};

// Check alias availability
exports.checkAlias = async (req, res, next) => {
  try {
    const { alias } = req.params;

    const existing = await Url.findOne({
      $or: [
        { customAlias: alias.toLowerCase() },
        { shortCode: alias.toLowerCase() },
      ],
    });

    res.json({
      success: true,
      data: { available: !existing },
    });
  } catch (error) {
    next(error);
  }
};
