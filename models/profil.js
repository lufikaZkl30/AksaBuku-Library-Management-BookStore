const mongoose = require('mongoose');

const profilSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  bio: {
    type: String,
    required: false
  },
  birthday: {
    type: Date,
    required: false
  },
  country: {
    type: String,
    required: false,
    default: '',
    enum: ['USA', 'Canada', 'UK', 'Germany', 'France', 'Indonesia', 'South Korea', 'Japan']
  },
  company: {
    type: String,
    required: false
  },
  website: {
    type: String,
    required: false
  },
  twitter: {
    type: String, 
    required: false
  },
  facebook: {
    type: String, 
    required: false
  },
  googlePlus: {
    type: String, 
    required: false
  },
  instagram: {
    type: String, 
    required: false
  },
  linkedin: {
    type: String, 
    required: false
  }
});

module.exports = mongoose.model('Profil', profilSchema);