const express = require('express');
const router = express.Router();
const Subscription = require('../../models/subscription');
const { isAdmin } = require('../../config/auth');
const nodemailer = require('nodemailer');

router.get('/', isAdmin, async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat memuat data.' });
  }
});

router.post('/sendemail', async (req, res) => {
  const { subject, message, recipients } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: recipients.join(','),
    subject: subject,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengirim email.' }); // Respons jika terjadi kesalahan
  }
});

module.exports = router;