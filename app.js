//IMPORT MODULES
var express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
//----------------

//APP
var app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//----------------

//CONFIG
require('./config/passport')(passport);
const { ensureAuthenticated, isAdmin } = require('./config/auth');
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
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//----------------

//FLASH MIDDLEWARE
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
//----------------

//ROUTER - BOOKS
const Books = require('./models/books');
const booksRouter = require('./routes/api/books');
app.use('/api/books', booksRouter);
//----------------

//ROUTER - USERS
const users = require('./models/users');
const usersRouter = require('./routes/api/users');
app.use('/', usersRouter);
//----------------

//ROUTER - CARTS
const Cart = require('./models/cartitem');
const cartRouter = require('./routes/api/carts');
app.use('/cart', cartRouter);
//----------------

//ROUTER - FEATURE (FIND, SORT, SEARCH)
const featureRouter = require('./routes/feature');
//----------------

//PAGES
  /*Index*/
  app.get("/", async (req, res) => {
    try{
      const latestBooks = await Books.find().sort({ createdAt: 1 }).limit(3);
      const discountBooks = await Books.aggregate([
        {$match: {promo: "Enable"}},
        {$sample: { size: 3 }}
      ]);
      const popularBooks = await Books.aggregate([
        { $sample: { size: 3 } }
      ]);
      res.render("index.ejs", 
      {
        title: 'Beranda', 
        books: latestBooks, 
        popularBooks: popularBooks, 
        discountBooks: discountBooks, 
        user: req.user
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

  /*Buku-Buku*/
  function handleBuku(app, kategori){
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
          res.render(`buku/${kategori}Page`, { books, title: judulKategori[kategori], kategori: judulKategori[kategori], user: req.user});
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
          res.render('buku/detailBuku', { book, title: 'Detail Buku', user: req.user});
      } catch (err) {
          res.status(500).json({ message: err.message });
      }
    });

    /*Jelajah*/
    app.get(`/jelajah`, async (req, res) => {
      try {
        const { keyword, sortBy, promo } = req.query;
        let books;

        if (keyword) {
          books = await featureRouter.searchBooks(keyword);
          if (sortBy) {
            books = await featureRouter.sortBooks(books, sortBy);
          }
        } else {
          books = await featureRouter.sortBooks(null, sortBy);
        }

        if (promo === 'enable') {
          const filteredBooks = await featureRouter.filterBooks(books);
          books = filteredBooks;
        }

        res.render(`buku/jelajah`, { books, title: "Jelajah", user: req.user, kategori: judulKategori[kategori] });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
  });
}

  handleBuku(app, 'novel');
  handleBuku(app, 'inspirasi');
  handleBuku(app, 'sejarah');
  handleBuku(app, 'komik');
  handleBuku(app, 'resepmasakan');
  handleBuku(app, 'bisnisekonomi');
  handleBuku(app, 'bahasaasing');
  handleBuku(app, 'medis');

  /*Pinjam Buku*/
  app.get("/rentbook", async (req, res) => {
    try {
        const books = await Books.find({ rentbook: "Enable" });
        res.render("rentbook.ejs", { books, title: "Peminjaman Buku", user: req.user });
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
        res.render('buku/detailBuku', { book, title: 'Detail Buku', user: req.user});
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
        res.render('readbook', { book, title: 'Baca Buku', pdfPath: book.pdfPath, user: req.user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  });


  /*Login & Sign Up*/
  app.get("/login", (req, res) => {
    res.render("users/login.ejs", {title: 'Login', user: req.user});
  });

  app.get("/signup", (req, res) => {
    res.render("users/signup.ejs", {title: 'Daftar', user: req.user});
  });

  app.get("/logout", (req, res) => {
    res.render("users/logout.ejs", {title: 'Logout', user: req.user});
  });

  app.get('/keranjang', ensureAuthenticated, async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
      if (!cart) {
        return res.render('users/keranjang', { title: 'Keranjang Belanja', items: [] });
      }
      res.render('users/keranjang', { title: 'Keranjang Belanja', items: cart.items });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Terjadi kesalahan saat menampilkan keranjang' });
    }
  });  

  app.get('/profil', ensureAuthenticated, async (req, res) => {
    res.render('users/profil', { title: 'Profil', user: req.user });
  });  

  /*Contact & Form*/
  app.get("/contact", (req, res) => {
    res.render("contact.ejs", {title: 'Hubungi Kami', msgCode: messageCode, user: req.user});
  });

  app.get("/form", (req, res) => {
    res.render("form.ejs", {title: 'Form Peminjaman', user: req.user});
  });

  /*Admin Page*/
  app.get("/admin/addbooks", isAdmin, (req, res) => {
    res.render("admin/addbooks.ejs", {title: 'Tambah Buku', user: req.user});
  });

  app.get('/admin/booklists', isAdmin, async (req, res) => {
    try {
      const books = await Books.find({});
      res.render('admin/booklists.ejs', { title: 'Daftar Buku', books: books, user: req.user});
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/admin/editbooks/:id', isAdmin, async (req, res) => {
    try {
      const book = await Books.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Buku tidak ditemukan' });
      }
      res.render('admin/editbooks.ejs', { title: 'Edit Buku', book: book, user: req.user });
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
        res.render('paymentPage', {title: 'Payment', book, user: req.user});
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
        res.render("contact.ejs", { title: 'Hubungi Kami', user: req.user});
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