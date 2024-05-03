const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Books',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  harga: {
    type: Number,
    required: true
  },
  totalHarga: {
    type: Number,
    required: true
  }
});

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  items: [CartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalHarga: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Cart', CartSchema);
