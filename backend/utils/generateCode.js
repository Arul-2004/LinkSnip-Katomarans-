const { nanoid } = require('nanoid');
const Url = require('../models/Url');

const generateCode = async (length = 7, maxRetries = 5) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  for (let i = 0; i < maxRetries; i++) {
    // Build code from nanoid characters
    let code = '';
    const id = nanoid(length);
    for (let j = 0; j < length; j++) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    
    // Check if code already exists
    const existing = await Url.findOne({ shortCode: code });
    if (!existing) {
      return code;
    }
  }
  
  // If all retries failed, use a longer code
  let code = '';
  const alphabet2 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let j = 0; j < length + 3; j++) {
    code += alphabet2[Math.floor(Math.random() * alphabet2.length)];
  }
  return code;
};

module.exports = generateCode;
