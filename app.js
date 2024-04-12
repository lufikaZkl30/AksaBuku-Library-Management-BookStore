var express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const mongoose = require('mongoose');
const session = require('express-session');

dotenv.config();

var app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

//VARIABEL
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
//--------------

//MONGODB CONFIG
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', ()=> console.log("Connected to MongoDB"));
//----------------

//MIDDLEWARE
app.use(express.urlencoded({extended: false}));
app.use(express.json());

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
app.get("/", (req, res) => {
  res.render("index.ejs", {title: 'Beranda'});
});

app.get("/novel", (req, res) => {
  res.render("novel.ejs", {title: 'Buku Novel'});
});

app.get("/inspirasi", (req, res) => {
  res.render("Inspirasi.ejs", {title: 'Buku Inspirasi'});
});

app.get("/login", (req, res) => {
  res.render("login.ejs", {title: 'login'});
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs", {title: 'Hubungi Kami', msgCode: messageCode});
});

app.get("/form", (req, res) => {
  res.render("form.ejs", {title: 'Form Peminjaman'});
});

app.get("/sukses", (req, res) => {
  res.render("sukses.ejs", {title: 'Sukses Meminjam'});
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

  //NOTIFICATION FOR NEW MESSAGE
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

  //THANK YOU EMAIL
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
//------------------

//LISTEN TO PORT
app.listen(port, ()=>{
  console.log(`http://localhost:${port}`);
});
