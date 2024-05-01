const express = require('express');
const router = express.Router();

module.exports = {
  ensureAuthenticated: function (req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
},
  isAdmin: function (req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
  }
  res.redirect('/login');
}
}