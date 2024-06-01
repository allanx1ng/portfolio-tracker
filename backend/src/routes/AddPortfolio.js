const jwt = require("jsonwebtoken")
require("dotenv").config()

const DatabaseInstance = require("../db/Database")
const db = DatabaseInstance.getInstance()

class AddPortfolio {
  static async createPortfolio(req, res) {
    const user = req.user.email
    const uid = req.user.uid
    const name = req.params.name
    const query =
      "INSERT INTO portfolio (uid, portfolio_name, account_type, provider) VALUES($1, $2, $3, $4)"
    try {
      //   const sql = "SELECT uid FROM UserAccount WHERE email = $1;"
      //   const uid = await db.queryDbValues(sql, [user])
      console.log(uid)

      const data = await db.queryDbValues(query, [uid, name, "custom", null])

      res.status(200).json({ message: "portfolio added" })
    } catch (err) {
      res.status(500).json({ error: err })
    }
  }

  static async getPortfolios(req, res) {
    const user = req.user.email
    const uid = req.user.uid
    const name = req.params.name
    if (!name) {
      const query = "SELECT * FROM portfolio WHERE uid = $1"
      try {
        //   const sql = "SELECT uid FROM UserAccount WHERE email = $1;"
        //   const uid = await db.queryDbValues(sql, [user])
        const data = await db.queryDbValues(query, [uid])

        res.status(200).json({ message: "portfolio fetched for user: " + uid, data: data })
      } catch (err) {
        res.status(500).json({ error: err })
      }
    } else if (name) {
      const query = "SELECT * FROM portfolio WHERE uid = $1 AND portfolio_name = $2"
      const query2 = "SELECT * FROM portfolio_assets WHERE uid = $1 AND portfolio_name=$2"
      try {
        //   const sql = "SELECT uid FROM UserAccount WHERE email = $1;"
        //   const uid = await db.queryDbValues(sql, [user])
        const data = await db.queryDbValues(query, [uid, name])
        if (data.length === 0) {
          res
            .status(404)
            .json({ message: " no portfolio with name: " + name + " for user: " + user })
        } else {
          const assets = await db.queryDbValues(query2, [uid, name])
          res.status(200).json({ message: "portfolio fetched for user: " + uid, data: {portfolio_data: data[0], assets: assets}})
        }
      } catch (err) {
        res.status(500).json({ error: err })
      }
    }
  }

  static async removePortfolio(req, res) {}
}

module.exports = AddPortfolio
