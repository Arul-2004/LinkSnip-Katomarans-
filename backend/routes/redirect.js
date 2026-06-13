const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const Click = require('../models/Click');
const UAParser = require('ua-parser-js');

// Redirect handler
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    // Find URL by shortCode or customAlias
    const url = await Url.findOne({
      $or: [{ shortCode: code }, { customAlias: code.toLowerCase() }],
      isActive: true,
    });

    if (!url) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Link Not Found - LinkSnip</title>
            <style>
              body { font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0B1736; color: white; }
              .container { text-align: center; padding: 2rem; }
              h1 { font-size: 3rem; margin-bottom: 0.5rem; }
              p { color: #8899b4; font-size: 1.1rem; }
              a { color: #EE6123; text-decoration: none; font-weight: 600; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>404</h1>
              <p>This short link doesn't exist or has been removed.</p>
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}">Go to LinkSnip</a>
            </div>
          </body>
        </html>
      `);
    }

    // Check if expired
    if (url.isExpired()) {
      return res.status(410).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Link Expired - LinkSnip</title>
            <style>
              body { font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0B1736; color: white; }
              .container { text-align: center; padding: 2rem; }
              h1 { font-size: 2rem; margin-bottom: 0.5rem; }
              p { color: #8899b4; font-size: 1.1rem; }
              a { color: #EE6123; text-decoration: none; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Link Expired</h1>
              <p>This short link has expired and is no longer active.</p>
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}">Go to LinkSnip</a>
            </div>
          </body>
        </html>
      `);
    }

    // Parse user agent
    const parser = new UAParser(req.headers['user-agent']);
    const browserInfo = parser.getBrowser();
    const osInfo = parser.getOS();
    const deviceInfo = parser.getDevice();

    // Get IP and geo info
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
    let country = 'Unknown';
    let city = 'Unknown';

    try {
      const geoip = require('geoip-lite');
      const geo = geoip.lookup(ip.replace('::ffff:', ''));
      if (geo) {
        country = geo.country || 'Unknown';
        city = geo.city || 'Unknown';
      }
    } catch (e) {
      // geoip lookup failed, use defaults
    }

    // Record click asynchronously (don't block redirect)
    Click.create({
      url: url._id,
      ip: ip.substring(0, 45),
      userAgent: (req.headers['user-agent'] || '').substring(0, 500),
      browser: browserInfo.name || 'Unknown',
      browserVersion: browserInfo.version || '',
      os: osInfo.name || 'Unknown',
      device: deviceInfo.type || 'Desktop',
      country,
      city,
      referer: req.headers.referer || req.headers.referrer || 'Direct',
    }).catch((err) => console.error('Click recording error:', err));

    // Update click count and last clicked
    Url.updateOne(
      { _id: url._id },
      { $inc: { totalClicks: 1 }, $set: { lastClickedAt: new Date() } }
    ).catch((err) => console.error('Click count update error:', err));

    // 301 redirect to original URL
    return res.redirect(301, url.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
