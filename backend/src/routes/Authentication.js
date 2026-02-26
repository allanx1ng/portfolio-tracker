const jwt = require("jsonwebtoken")
const crypto = require("crypto")
require("dotenv").config()

const DatabaseInstance = require("../db/Database")
const db = DatabaseInstance.getInstance()

const { OAuth2Client } = require("google-auth-library")

const secretKey = process.env.JWT_SECRET_KEY
const ACCESS_TOKEN_EXPIRY = "2h"
const REFRESH_TOKEN_EXPIRY_DAYS = 30

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

  // Generate a cryptographically random refresh token and store it in DB
  static async createRefreshToken(uid) {
    const token = crypto.randomBytes(64).toString("hex")
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000)

    await db.queryDbValues(
      `INSERT INTO refresh_tokens (uid, token, expires_at) VALUES ($1, $2, $3)`,
      [uid, token, expiresAt]
    )

    return token
  }

  static async login(req, res) {
    try {
      const user = { email: req.body.email }
      const query = "SELECT uid FROM UserAccount WHERE email = $1"
      const result = await db.queryDbValues(query, [user.email])

      if (!result || result.length === 0) {
        return res.status(401).json({ message: "User not found" })
      }

      const uid = result[0].uid

      const accessToken = jwt.sign({ email: user.email, uid }, secretKey, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      })

      const refreshToken = await Authentication.createRefreshToken(uid)

      if (req.body.src == "oauth") {
        return res.redirect(
          `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/google/callback?token=${accessToken}&refreshToken=${refreshToken}`
        )
      }

      return res.status(201).json({
        message: "Logged in successfully",
        token: accessToken,
        refreshToken,
      })
    } catch (err) {
      console.error("Login error:", err)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  static async refresh(req, res) {
    try {
      const { refreshToken } = req.body

      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token required" })
      }

      // Look up the refresh token in DB
      const rows = await db.queryDbValues(
        `SELECT rt.id, rt.uid, rt.expires_at, ua.email
         FROM refresh_tokens rt
         JOIN useraccount ua ON ua.uid = rt.uid
         WHERE rt.token = $1`,
        [refreshToken]
      )

      if (!rows || rows.length === 0) {
        return res.status(403).json({ message: "Invalid refresh token" })
      }

      const row = rows[0]

      // Check expiry
      if (new Date(row.expires_at) < new Date()) {
        // Clean up expired token
        await db.queryDbValues(`DELETE FROM refresh_tokens WHERE id = $1`, [row.id])
        return res.status(403).json({ message: "Refresh token expired" })
      }

      // Delete the old refresh token (rotation — one-time use)
      await db.queryDbValues(`DELETE FROM refresh_tokens WHERE id = $1`, [row.id])

      // Issue new access token + new refresh token
      const accessToken = jwt.sign({ email: row.email, uid: row.uid }, secretKey, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      })

      const newRefreshToken = await Authentication.createRefreshToken(row.uid)

      return res.status(200).json({
        token: accessToken,
        refreshToken: newRefreshToken,
      })
    } catch (err) {
      console.error("Refresh error:", err)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  static async logout(req, res) {
    try {
      const { refreshToken } = req.body

      if (refreshToken) {
        await db.queryDbValues(`DELETE FROM refresh_tokens WHERE token = $1`, [refreshToken])
      }

      // Also clean up all expired tokens for hygiene
      await db.queryDbValues(`DELETE FROM refresh_tokens WHERE expires_at < NOW()`)

      return res.status(200).json({ message: "Logged out successfully" })
    } catch (err) {
      console.error("Logout error:", err)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  static async oauth(req, res) {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:3000")
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Referrer-Policy", "no-referrer-when-downgrade")
    const redirectURL = `${process.env.BACKEND_URL || "http://localhost:4321"}/oauth`

    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectURL
    )

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
