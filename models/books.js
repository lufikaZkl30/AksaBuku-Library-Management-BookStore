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
    type: Number,
    required: false
  },
  bulan: {
    type: String,
    enum: ['', 'Januari', 'Februari', 'Maret', 'April', 
    'Mei', 'Juni', 'Juli', 'Agustus', 'September', 
    'Oktober', 'November', 'Desember'],
    required: false
  },
  tahun: {
    type: Number,
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
  isbn: {
    type: String,
    required: false
  },
  kategori: {
    type: String,
    required: true,
    enum: ['novel', 'inspirasi', 'sejarah', 'komik', 'resepmasakan', 'bisnisekonomi', 'bahasaasing', 'medis']
  },
  promo: {
    type: String,
    required: false,
    enum: ['Disable', 'Enable']
  },
  diskon: {
    type: Number,
    validate: {
      validator: function () {
          return this.promo === 'Enable' ? !!this.diskon : true;
      },
      message: 'Diskon hanya dapat ditentukan jika promo diaktifkan.'
  }
}
});

module.exports = mongoose.model('Books', bukuSchema);