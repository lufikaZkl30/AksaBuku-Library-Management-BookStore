const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  created:{
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = mongoose.model('Users', userSchema);