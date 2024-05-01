const express = require('express');
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
}

