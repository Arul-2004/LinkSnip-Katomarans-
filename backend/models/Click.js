const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema(
  {
    url: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Url',
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ip: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    browserVersion: {
      type: String,
      default: '',
    },
    os: {
      type: String,
      default: 'Unknown',
    },
    device: {
      type: String,
      default: 'Desktop',
    },
    country: {
      type: String,
      default: 'Unknown',
    },
    city: {
      type: String,
      default: 'Unknown',
    },
    referer: {
      type: String,
      default: 'Direct',
    },
  },
  {
    timestamps: false,
  }
);

// Indexes for analytics queries
clickSchema.index({ url: 1, timestamp: -1 });
clickSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Click', clickSchema);
