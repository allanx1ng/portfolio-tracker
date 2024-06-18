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

  static async addWalletPortfolio(req, res) {
    const uid = req.user.uid
    const { provider, portfolioName, walletAddress, blockchain } = req.body
    if (!walletAddress || !provider || !portfolioName) {
      return res.status(400).send({ error: "Wallet address is required" })
    }

    switch (blockchain) {
      case 'SOLANA':
        break;
      case 'ETHEREUM':
        break;
      default:
        break;
    }


    const sql = `SELECT * FROM portfolio WHERE uid=$1 AND portfolio_name=$2`
    const sql2 = `SELECT * FROM portfolio WHERE wallet_address=$1`

    const query = `
      INSERT INTO Portfolio (uid, portfolio_name, account_type, provider, wallet_address)
      VALUES ($1, $2, 'wallet', $3, $4) 
    `

      try {
        const data = await db.queryDbValues(sql, [uid, portfolioName])
        const data2 = await db.queryDbValues(sql2, [walletAddress])
      } catch (err) {
        throw err
      }




  }

  static async removePortfolio(req, res) {
    const uid = req.user.uid
    const name = req.params.name
    const sql = `DELETE FROM portfolio WHERE uid=$1 AND portfolio_name=$2`
    try {
      const data = await db.queryDbValues(sql, [uid, name])
      res.status(200).json({ message: "portfolio removed" })
    } catch (err) {
      res.status(500)
    }
  }
}

module.exports = AddPortfolio
