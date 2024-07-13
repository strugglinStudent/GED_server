// models/File.js
const mongoose = require('mongoose');

const Document = new mongoose.Schema({
  originalName: String,
  mimeType: String,
  path: String,
  size: Number,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Document', Document);
