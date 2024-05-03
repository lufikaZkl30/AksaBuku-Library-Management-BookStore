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

    // console.log('Product ID:', productId);
    // console.log('Quantity:', quantity);
    
    const product = await Product.findById(productId);
    if (!product) {
      // console.log('Product not found:', productId);
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    
    // Total harga
    const harga = product.harga;
    const totalHarga = harga * quantity;

    if (isNaN(totalHarga)) {
      // console.log('Invalid total harga:', totalHarga);
      return res.status(400).json({ message: 'Total harga tidak valid' });
    }
    
    const newItem = {
      product: productId,
      quantity: quantity,
      harga: product.harga,
      totalHarga: totalHarga
    };

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      const newCart = new Cart({
        user: req.user.id,
        items: [newItem],
        totalItems: quantity,
        totalHarga
      });
      await newCart.save();
    } else {
      cart.items.push(newItem);
      cart.totalItems += quantity;
      cart.totalHarga += totalHarga;
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
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Keranjang tidak ditemukan' });
    }

    const item = cart.items.find(item => item._id == itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item tidak ditemukan di keranjang' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item._id != itemId);
    } else {
      item.quantity = quantity;
      item.totalHarga = item.harga * quantity;
    }

    // Update totalItems and totalHarga
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalHarga = cart.items.reduce((total, item) => total + item.totalHarga, 0);

    await cart.save();

    res.status(200).json({ message: 'Jumlah item berhasil diubah' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengubah jumlah item' });
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
