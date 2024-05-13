// // const DatabaseInstance = require("../database/Database");
const jwt = require("jsonwebtoken")
require("dotenv").config()

const DatabaseInstance = require("../db/Database")
const db = DatabaseInstance.getInstance()

// // const db = DatabaseInstance.getInstance();
const secretKey = process.env.JWT_SECRET_KEY
class Authentication {
  // Authenticate token middleware for protected routes
  static authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]

    if (authHeader == null) return res.sendStatus(401)
    const token = authHeader.split(" ")[1] // Bearer <token>
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

  static async login(req, res) {
    try {
      const user = { email: req.body.email, password: req.body.password }
      // check against user in db
      console.log(user)
      const token = jwt.sign(user, secretKey, { expiresIn: "12h" })
      console.log(token)
      return res.status(201).json({ message: "Logged in successfully", token: token })
    } catch (err) {
      res.status(500)
    }
  }

  static async logout(req, res) {}
}

module.exports = Authentication
