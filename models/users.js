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
  profileImage: {
    type: String,
    default: 'public/assets/img/default-user-icon.jpg',
  },
  created:{
    type: Date,
    default: Date.now,
    required: true
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  }
});

module.exports = mongoose.model('Users', userSchema);