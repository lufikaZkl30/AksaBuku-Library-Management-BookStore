const express = require('express');
const router = express.Router();
const Books = require('../models/books');

const searchBooks = async (keyword) => {
  const regex = new RegExp(keyword, 'i');
  const results = await Books.find({ $or: [{ judul: regex }, { author: regex }] });
  return results;
};

const sortBooks = async (sortBy, books) => {
  let sortQuery = {};
  if (sortBy === 'ascJudul') {
    sortQuery = { judul: 1 };
  } else if (sortBy === 'descJudul') {
    sortQuery = { judul: -1 };
  } else if (sortBy === 'ascPrice') {
    sortQuery = { harga: 1 };
  } else if (sortBy === 'descPrice') {
    sortQuery = { harga: -1 };
  }
  const results = books ? books.sort(sortQuery) : await Books.find().sort(sortQuery);
  return results;
};

const filterBooks = async () => {
  const results = await Books.find({ promo: 'Enable' });
  return results;
};

module.exports = { searchBooks, sortBooks, filterBooks };