const validator = require("validator")
const Emailer = require("../util/Emailer")
const bcrypt = require("bcrypt")
const DatabaseInstance = require("../db/Database")
const db = DatabaseInstance.getInstance()
require('dotenv').config()
const secretKey = process.env.EMAIL_VERIFY_KEY

class Account {
  static async create(req, res) {
    const { email, username, password } = req.body
    try {
      if (!username || !email || !password) {
        return res.status(400).send({ message: "Please fill out all fields" })
      }

      if (!validator.isEmail(email)) {
        return res.status(400).send({message: 'email format not valid'})
      }
      if (password.length > 20 || password.length < 3) {
        return res.status(400).send({password: 'password length not valid'})
      }
      if (!username) {
        return res.status(400).send({message: 'username cannot be empty'})
      }

      // check if user is already registered
      const dataEmail = await db.queryDbValues(`SELECT * FROM account WHERE email=$1`, [email])
      if (dataEmail.length > 0) {
        return res.status(400).send({ message: "User with this email already exists" })
      }
      const dataUser = await db.queryDbValues(`SELECT * FROM account WHERE username=$1`, [username])
      if (dataUser.length > 0) {
        return res.status(400).send({ message: "Username already exists" })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const insertAccount = `INSERT INTO account (email, username, created_on) VALUES ($1, $2, $3);`
      const insertLogin = `INSERT INTO login (email, password) VALUES ($1, $2);`

      // Get the current timestamp in milliseconds
      const timestamp = Date.now()

      // Create a Date object from the timestamp
      const date = new Date(timestamp)

      // Convert the Date object to an ISO string and then to a PostgreSQL TIMESTAMP string
      const pgTimestamp = date.toISOString().replace("T", " ").replace("Z", "")

      const dataAccount = await db.queryDbValues(insertAccount, [email, username, pgTimestamp])

      const dataLogin = await db.queryDbValues(insertLogin, [email, hashedPassword])

     

      // Emailer.sendVerificationEmail(email)

      res.status(201).send({ result: "registration success" })
    } catch (error) {
      console.error(error)
      res.status(500).send({ message: "Server Error" })
    }
  }

  static async verify(req, res) {}
}

module.exports = Account
