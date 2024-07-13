const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({

  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    select: false,
  },
  companyName: {
    type: String,
    ref: 'Company',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', User);
