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

    if (authHeader == null) return res.status(401).json({ message: "401 not authorized" })
    const token = authHeader.split(" ")[1] // Bearer <token>
    if (token == null) return res.status(401).json({ message: "401 not authorized" })

    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(403).json({ message: "403 not authorized" })
      req.user = user
      next()
    })
  }

  static async login(req, res) {
    try {
      const user = { email: req.body.email, password: req.body.password }
      // check against user in db
      const query = "SELECT uid FROM UserAccount WHERE email = $1"

      const uid = await db.queryDbValues(query, [user.email])

      console.log(user)
      console.log(uid[0].uid)
      const token = jwt.sign({ email: user.email, uid: uid[0].uid }, secretKey, {
        expiresIn: "12h",
      })
      console.log(token)
      return res.status(201).json({ message: "Logged in successfully", token: token })
    } catch (err) {
      res.status(500)
    }
  }

  static async logout(req, res) {}
}

module.exports = Authentication
