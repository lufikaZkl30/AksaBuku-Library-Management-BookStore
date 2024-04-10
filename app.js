var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static("public"));

//  beranda
app.get("/", (req, res) => {
  res.render("index.ejs", {title: 'Beranda'});
});

// jelajah
app.get("/novel", (req, res) => {
  res.render("novel.ejs", {title: 'Buku Novel'});
});

app.get("/inspirasi", (req, res) => {
  res.render("Inspirasi.ejs", {title: 'Buku Inspirasi'});
});

// contact
app.get("/contact", (req, res) => {
  res.render("contact.ejs", {title: 'Hubungi Kami'});
});

// form
app.get("/form", (req, res) => {
  res.render("form.ejs", {title: 'Form Peminjaman'});
});

app.get("/sukses", (req, res) => {
  res.render("sukses.ejs", {title: 'Sukses Meminjam'});
});

app.listen(8080);
console.log('Server is listening on port 8080');