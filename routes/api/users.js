const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../../models/users");
const Profil = require("../../models/profil");

//SIGN IN POST
router.post("/signup", (req, res) => {
  const { name, uname, phone, email, password, password2 } = req.body;
  let errors = [];

  //Check required fields
  if (!name || !uname || !phone || !email || !password || !password2) {
    errors.push({ msg: "Harap menginput semua data" });
  }

  // Password match
  if (password !== password2) {
    errors.push({ msg: "Password tidak sama" });
  }

  //Check name length
  if (name.length < 3 || name.length > 50) {
    errors.push({ msg: "Nama minimal 3 karakter" });
  }

  //Check username length
  if (uname.length < 3 || uname.length > 50) {
    errors.push({ msg: "Username minimal 3 karakter" });
  }

  //Check pass length
  if (password.length < 6 || password2.length < 6) {
    errors.push({ msg: "Password minimal 6 karakter" });
  }

  //Check errors
  if (errors.length > 0) {
    res.render("users/signup", {
      title: "Sign Up",
      errors,
      name,
      uname,
      phone,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email sudah terdaftar" });
        res.render("users/signup", {
          title: "Sign Up",
          errors,
          name,
          uname,
          phone,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          uname,
          phone,
          email,
          password
        });
        //Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;

            //Save user
            newUser
              .save()
              .then(async(user) => {
                const newProfil = new Profil({
                  user: user._id,
                  bio: '',
                  birthday: '',
                  country: '',
                  company:'',
                  website: '',
                  twitter: '',
                  facebook: '',
                  googlePlus: '',
                  instagram: '',
                  linkedin: ''
                });
                await newProfil.save();
                
                req.flash("success_msg", "Anda berhasil registrasi, Silahkan Login");
                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

//LOGIN POST
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});


//LOGOUT
router.get("/logout", (req, res) => {
  req.logout(function(err) {
    req.flash("success_msg", "Anda berhasil Log out");
    res.redirect("/");
  })
});

module.exports = router;