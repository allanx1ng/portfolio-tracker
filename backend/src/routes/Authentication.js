// // const DatabaseInstance = require("../database/Database");
const jwt = require("jsonwebtoken")
require("dotenv").config()

const DatabaseInstance = require("../db/Database")
const db = DatabaseInstance.getInstance()

const { OAuth2Client } = require("google-auth-library")

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

      if (req.body.src == "oauth") {
        // Redirect to the frontend with the token
        return res.redirect(`http://localhost:3000/auth/google/callback?token=${token}`)
      }

      return res.status(201).json({ message: "Logged in successfully", token: token })
    } catch (err) {
      res.status(500)
    }
  }

  static async logout(req, res) {}

  static async oauth(req, res) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Referrer-Policy", "no-referrer-when-downgrade")
    const redirectURL = "http://localhost:4321/oauth"

    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectURL
    )

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope:
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid ",
      prompt: "consent",
    })

    res.json({ url: authorizeUrl })
  }
}

module.exports = Authentication
