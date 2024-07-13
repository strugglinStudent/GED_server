const mongoose = require('mongoose');

const { Schema } = mongoose;
const Migration = new Schema({
  file: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Migration', Migration);
