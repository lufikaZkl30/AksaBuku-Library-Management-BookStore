const mongoose = require('mongoose');

const profilSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  bio: {
    type: String,
    required: false,
    default:''
  },
  birthday: {
    type: Date,
    required: false,
    default:''
  },
  country: {
    type: String,
    required: false,
    default: '',
    enum: ['', 'USA', 'Canada', 'UK', 'Germany', 'France', 'Indonesia', 'South Korea', 'Japan']
  },
  company: {
    type: String,
    default:'',
    required: false
  },
  website: {
    type: String,
    required: false,
    default:''
  },
  twitter: {
    type: String, 
    required: false,
    default:''
  },
  facebook: {
    type: String, 
    required: false,
    default:''
  },
  googlePlus: {
    type: String, 
    required: false,
    default:''
  },
  instagram: {
    type: String, 
    required: false,
    default:''
  },
  linkedin: {
    type: String, 
    required: false,
    default:''
  }
});

module.exports = mongoose.model('Profil', profilSchema);