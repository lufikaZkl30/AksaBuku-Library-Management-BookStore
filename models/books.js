const mongoose = require('mongoose');

const bukuSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  penerbit: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  sinopsis: {
    type: String,
    required: true
  },
  tanggal: {
    type: Date,
    required: true
  },
  halaman: {
    type: Number,
    required: true
  },
  harga: {
    type: Number,
    required: true
  },
  ISBN: {
    type: String,
    required: false
  },
  kategori: {
    type: String,
    required: true,
    enum: ['Novel', 'Inspirasi']
  }
});

module.exports = mongoose.model('Books', bukuSchema);