const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Books = require('./books');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/booksCollection')
  .then(() => {
    console.log("Berhasil terhubung ke database MongoDB");
  })
  .catch(error => {
    console.error("Gagal terhubung ke database MongoDB:", error);
  });

app.post('/add-book', async (req, res) => {
  const { judul, author, penerbit, imageUrl, sinopsis, tahun, halaman, harga, stok, kategori } = req.body;
  
  try {
    const newBook = new Books({
      judul,
      author,
      penerbit,
      imageUrl,
      sinopsis,
      tahun,
      halaman,
      harga,
      stok,
      kategori
    });

    const savedBook = await newBook.save();
    console.log("Buku berhasil ditambahkan:", savedBook);
    res.send("Buku berhasil ditambahkan!");
  } catch (error) {
    console.error("Gagal menambahkan buku:", error);
    res.status(500).send("Gagal menambahkan buku!");
  }
});
