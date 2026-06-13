const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const router = express.Router();
const urlController = require('../controllers/urlController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// Multer config for CSV upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
});

// Create short URL
router.post(
  '/',
  auth,
  validate([
    body('originalUrl')
      .trim()
      .notEmpty()
      .withMessage('URL is required')
      .isURL({ require_protocol: true })
      .withMessage('Please enter a valid URL with http:// or https://'),
    body('customAlias')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Custom alias must be between 3 and 30 characters'),
    body('title').optional().trim().isLength({ max: 200 }).withMessage('Title too long'),
    body('expiresAt').optional().isISO8601().withMessage('Invalid date format'),
  ]),
  urlController.createUrl
);

// Get all user URLs
router.get('/', auth, urlController.getUrls);

// Bulk create from CSV
router.post('/bulk', auth, upload.single('csv'), urlController.bulkCreate);

// Check alias availability
router.get('/check-alias/:alias', auth, urlController.checkAlias);

// Get single URL
router.get('/:id', auth, urlController.getUrl);

// Update URL
router.put(
  '/:id',
  auth,
  validate([
    body('originalUrl')
      .optional()
      .trim()
      .isURL({ require_protocol: true })
      .withMessage('Please enter a valid URL'),
    body('title').optional().trim().isLength({ max: 200 }),
    body('expiresAt').optional({ nullable: true }),
  ]),
  urlController.updateUrl
);

// Delete URL
router.delete('/:id', auth, urlController.deleteUrl);

module.exports = router;
