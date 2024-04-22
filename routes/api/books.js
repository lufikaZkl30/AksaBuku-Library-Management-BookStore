const express = require('express');
const router = express.Router();
const Books = require('../../models/books');

router.get('/:id?', async (req, res) => {
  try {
    if (req.params.id) {
      const book = await Books.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(book);
    } else {
      const books = await Books.find({});
      res.json(books);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const book = new Books(req.body);
  try {
    const newBook = await book.save();
    res.redirect('/admin/booklists');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedBook = await Books.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.redirect('/admin/booklists');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBook = await Books.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Buku tidak ditemukan.' });
    }
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
