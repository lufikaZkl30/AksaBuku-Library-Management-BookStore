//IMPORT MODULES
var express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
//----------------

//APP
var app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//----------------


//ROUTER - BOOKS
const Books = require('./models/books');
const booksRouter = require('./routes/api/books');
app.use('/api/books', booksRouter);
//----------------

//VARIABEL
dotenv.config();
const port = process.env.PORT
const sender = process.env.EMAIL_SENDER
const notifier = process.env.EMAIL_NOTIFIER
const passw = process.env.EMAIL_PASSWORD
let messageCode = randomstring.generate(8)
//----------------

//NODEMAILER AUTH
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: sender,
    pass: passw,
  }
});
//----------------

//MONGODB CONFIG
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', ()=> console.log("Connected to MongoDB"));
//----------------

//MIDDLEWARE
app.use(session({
  secret: 'tempatrahasia',
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});
//----------------

//PAGES
/*Index*/
app.get("/", async (req, res) => {
  try{
    const latestBooks = await Books.find().sort({ createdAt: 1 }).limit(3);
    const discountBooks = await Books.find({ promo: "Enable" });
    const popularBooks = await Books.aggregate([
      { $sample: { size: 3 } }
    ]);
    res.render("index.ejs", {title: 'Beranda', books: latestBooks, popularBooks: popularBooks, discountBooks: discountBooks});
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

/*Buku-Buku*/
function handleKategori(app, kategori){
  const judulKategori = {
      'novel': 'Buku Novel',
      'inspirasi': 'Buku Inspirasi',
      'sejarah': 'Buku Sejarah',
      'komik': 'Buku Komik',
      'resepmasakan': 'Buku Resep & Masakan',
      'bisnisekonomi': 'Buku Bisnis & Ekonomi',
      'bahasaasing': 'Buku Bahasa Asing',
      'medis': 'Buku Medis'
  };

  app.get(`/${kategori}`, async (req, res) => {
    try {
        const books = await Books.find({ kategori: kategori });
        res.render(`buku/${kategori}Page`, { books, title: judulKategori[kategori] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  });

  app.get(`/${kategori}/:id`, async (req, res) => {
    try {
        const book = await Books.findById(req.params.id);
        if (!book || book.kategori.toLowerCase() !== kategori) {
            return res.status(404).json({ message: 'Buku tidak ditemukan.' });
        }
        res.render('buku/detailBuku', { book, title: 'Detail Buku' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  });
}

handleKategori(app, 'novel');
handleKategori(app, 'inspirasi');
handleKategori(app, 'sejarah');
handleKategori(app, 'komik');
handleKategori(app, 'resepmasakan');
handleKategori(app, 'bisnisekonomi');
handleKategori(app, 'bahasaasing');
handleKategori(app, 'medis');


/*Pinjam Buku*/
app.get("/rentbook", async (req, res) => {
  try {
      const books = await Books.find({ rentbook: "Enable" });
      res.render("rentbook.ejs", { books, title: "Peminjaman Buku" });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

app.get('/rentbook/:id', async (req, res) => {
  try {
      const book = await Books.findById(req.params.id);
      if (!book) {
          return res.status(404).json({ message: 'Buku tidak ditemukan.' });
      }
      res.render('buku/detailBuku', { book, title: 'Detail Buku' });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

app.get('/readbook/:id', async (req, res) => {
  try {
      const book = await Books.findById(req.params.id);
      if (!book) {
          return res.status(404).json({ message: 'Buku tidak ditemukan.' });
      }
      res.render('readbook', { book, title: 'Baca Buku', pdfPath: book.pdfPath });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


/*Login & Sign Up*/
app.get("/login", (req, res) => {
  res.render("login.ejs", {title: 'Login'});
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs", {title: 'Daftar'});
});

/*Contact & Form*/
app.get("/contact", (req, res) => {
  res.render("contact.ejs", {title: 'Hubungi Kami', msgCode: messageCode});
});

app.get("/form", (req, res) => {
  res.render("form.ejs", {title: 'Form Peminjaman'});
});

/*Admin Page*/
app.get("/admin/addbooks", (req, res) => {
  res.render("admin/addbooks.ejs", {title: 'Tambah Buku'});
});

app.get('/admin/booklists', async (req, res) => {
  try {
    const books = await Books.find({});
    res.render('admin/booklists.ejs', { title: 'Daftar Buku', books: books });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/admin/editbooks/:id', async (req, res) => {
  try {
    const book = await Books.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    res.render('admin/editbooks.ejs', { title: 'Edit Buku', book: book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*Payment*/
app.get('/payment/:id', async (req, res) => {
  try {
      const book = await Books.findById(req.params.id);
      if (!book) {
          return res.status(404).json({ message: 'Book not found' });
      }
      res.render('paymentPage', {title: 'Payment', book});
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});
//----------------

//POST REQUEST
app.post('/contact', (req,res) => {
  const output = `
    <h3>Detail Kontak:</h3>
    <p>Name: ${req.body.name}</p>
    <p>Email: ${req.body.email}</p>
    <h3>Message:</h3>
    <p>${req.body.message}</p>
    <hr>
    <p>Nomor Referensi: ${messageCode}</p>
  `;

  const thankyou = `
    <p>Halo, ${req.body.name}</p>
    <p>Nomor Referensi Anda: ${messageCode}</p>
    <p>Terima kasih telah menghubungi tim AKSA BUKU.
    Kami akan segera menghubungi Anda.</p><br>
    <p>Salam,</p>
    <p>Aksa Buku</p>
  `;

  //Notification for new Message
  let mailOptions = {
    from: sender,
    to: notifier,
    subject: 'You have a new email request!',
    html: output
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }  
      console.log('Message sent: %s' + info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.render("contact.ejs", { title: 'Hubungi Kami'});
  });

  //Thank You Email
  let mailOptionsThankYou = {
    from: sender,
    to: `${req.body.email}`,
    subject: 'Thank you for contacting us!',
    html: thankyou
  };

  transporter.sendMail(mailOptionsThankYou, (error, info) => {
    if (error) {
      console.log('Error sending thank you email:', error);
    } else {
      console.log('Thank you email sent:', info.messageId);
    }
  });
  messageCode = randomstring.generate(8);
  res.redirect('/contact');
})


//LISTEN TO PORT
app.listen(port, ()=>{
  console.log(`http://localhost:${port}`);
});
//--------------