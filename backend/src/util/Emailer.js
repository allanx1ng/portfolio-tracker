const nodemailer = require("nodemailer")
const crypto = require("crypto")
require("dotenv").config()
const jwt = require("jsonwebtoken")
const secretKey = process.env.JWT_SECRET_KEY

async function sendVerificationEmail(userEmail) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // user: process.env.EMAIL_USER,
        // pass: process.env.EMAIL_PASS,
      },
    })

    const token = jwt.sign({ email: userEmail }, secretKey, { expiresIn: "12h" })

    const mailOptions = {
      from: "no-reply@yourdomain.com",
      to: userEmail,
      subject: "Please verify your email",
      html: `Please click this link to confirm your email address: <a href="https://yourdomain.com/verify-email?token=${token}">Verify Email</a>`,
    }

    await transporter.sendMail(mailOptions)
  } catch (err) {
    console.log(err)
  }
}

function generateVerificationToken() {
  return crypto.randomBytes(16).toString("hex") // generates a random 32 characters hex string
}

module.exports = { sendVerificationEmail }
