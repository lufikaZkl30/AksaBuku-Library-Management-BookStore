const express = require('express');
const router = express.Router();
const Cart = require('../../models/cartitem');
const { ensureAuthenticated } = require('../../config/auth');
const Product = require('../../models/books');

// MELIHAT ITEM DI KERANJANG
router.get('/view', ensureAuthenticated, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.render('cart/empty', { title: 'Keranjang Belanja' });
    }

    res.render('cart/view', { title: 'Keranjang Belanja', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan saat menampilkan keranjang' });
  }
});

// ADD ITEMS TO CART
router.post('/add', ensureAuthenticated, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      // console.log('Product not found:', productId);
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }

    const usedQuantity = quantity !== undefined ? quantity : 1;
    const cart = await Cart.findOne({ user: req.user.id });
    
    // Total harga
    const harga = product.harga;
    const totalHarga = harga * usedQuantity;

    if (isNaN(totalHarga)) {
      // console.log('Invalid total harga:', totalHarga);
      return res.status(400).json({ message: 'Total harga tidak valid' });
    }
    
    const newItem = {
      product: productId,
      quantity: usedQuantity,
      harga: product.harga,
      totalHarga: totalHarga
    };

    if (!cart) {
      const newCart = new Cart({
        user: req.user.id,
        items: [{
          product: productId,
          quantity: usedQuantity,
          harga: product.harga,
          totalHarga: product.harga * usedQuantity
        }],
        totalItems: usedQuantity,
        totalHarga: product.harga * usedQuantity
      });
      await newCart.save();
    } else {
      let itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex !== -1) {
        cart.items[itemIndex].quantity += usedQuantity;
        cart.items[itemIndex].totalHarga += product.harga * usedQuantity;
      } else {
        cart.items.push({
          product: productId,
          quantity: usedQuantity,
          harga: product.harga,
          totalHarga: product.harga * usedQuantity
        });
      }

      cart.totalItems += usedQuantity;
      cart.totalHarga += product.harga * usedQuantity;

      await cart.save();
    }

    res.status(200).json({ message: 'Item berhasil ditambahkan ke keranjang' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan item ke keranjang' });
  }
});

// UPDATE JUMLAH ITEM
router.post('/update/:itemId', ensureAuthenticated, async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { operation } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Keranjang tidak ditemukan' });
    }

    const item = cart.items.find(item => item._id == itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item tidak ditemukan di keranjang' });
    }

    if (operation === 'increase') {
      item.quantity += 1;
      item.totalHarga = item.harga * item.quantity;
    } else if (operation === 'decrease') {
      const newQuantity = item.quantity - 1;
      if (newQuantity <= 0) {
        return res.status(400).json({ message: 'Quantity tidak dapat kurang dari 1' });
      }
      item.quantity = newQuantity;
      item.totalHarga = item.harga * newQuantity;
    } else {
      return res.status(400).json({ message: 'Operasi tidak valid' });
    }

    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalHarga = cart.items.reduce((total, item) => total + item.totalHarga, 0);

    await cart.save();

    res.status(200).json({ message: 'Quantity item berhasil diubah' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengubah quantity item' });
  }
});

// MENGHAPUS ITEM
router.post('/delete/:itemId', ensureAuthenticated, async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Keranjang tidak ditemukan' });
    }

    cart.items = cart.items.filter(item => item._id != itemId);

    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalHarga = cart.items.reduce((total, item) => total + item.totalHarga, 0);

    await cart.save();

    res.redirect('/keranjang');
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan saat menghapus item dari keranjang');
  }
});

module.exports = router;
