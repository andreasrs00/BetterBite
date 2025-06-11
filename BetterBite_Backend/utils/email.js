// utils/email.js
require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendResetEmail(toEmail, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Ganti sesuai provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Admin" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset Password",
    html: `<p>Klik link berikut untuk reset password:</p><a href="${resetLink}">${resetLink}</a>`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendResetEmail;
