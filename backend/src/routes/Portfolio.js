const jwt = require("jsonwebtoken")
require("dotenv").config()

const DatabaseInstance = require("../db/Database")
const db = DatabaseInstance.getInstance()

class Portfolio {
  static async addAsset(req, res) {
    const user = req.user.email
    const uid = req.user.uid
    const portfolio = req.body.portfolio
    const asset = req.body.asset
    const query = `INSERT INTO Portfolio_assets (uid, portfolio_name, asset_name, asset_ticker, amount, avg_price) VALUES($1, $2, $3, $4, $5, $6)
      ON CONFLICT (uid, portfolio_name, asset_name, asset_ticker)
      DO UPDATE SET 
      amount = Portfolio_assets.amount + EXCLUDED.amount,
      avg_price = (
          (Portfolio_assets.avg_price * Portfolio_assets.amount) + (EXCLUDED.avg_price * EXCLUDED.amount)
      ) / (Portfolio_assets.amount + EXCLUDED.amount);`
    try {
      //   const sql = "SELECT uid FROM UserAccount WHERE email = $1;"
      //   const uid = await db.queryDbValues(sql, [user])
      console.log(asset)
      //   console.log(req)

      const data = await db.queryDbValues(query, [
        uid,
        portfolio,
        asset.name,
        asset.ticker,
        asset.amount,
        asset.price,
      ])

      res.status(201).json({ message: "asset added" })
    } catch (err) {
      console.log(err)
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

      try {
        //   const sql = "SELECT uid FROM UserAccount WHERE email = $1;"
        //   const uid = await db.queryDbValues(sql, [user])
        const data = await db.queryDbValues(query, [uid, name])
        if (data.length === 0) {
          res
            .status(404)
            .json({ message: " no portfolio with name: " + name + " for user: " + user })
        } else {
          const promises = []
          promises.push(Portfolio.getAssets(uid, name))
          promises.push(Portfolio.getPortfolioTVL(uid, name))
          const [assets, tvl] = await Promise.all(promises)
          console.log(tvl)
          // const query2 = "SELECT * FROM portfolio_assets WHERE uid = $1 AND portfolio_name=$2"
          // const assets = await db.queryDbValues(query2, [uid, name])
          console.log(assets)
          res.status(200).json({
            message: "portfolio fetched for user: " + uid,
            data: { portfolio_data: data[0], assets: assets, tvl: tvl[0].total_usd_value},
          })
        }
      } catch (err) {
        res.status(500).json({ error: err })
      }
    }
  }

  static async getAssets(uid, name) {
    const query2 = "SELECT * FROM portfolio_assets WHERE uid = $1 AND portfolio_name=$2"
    try {
      const data = await db.queryDbValues(query2, [uid, name])
      return data
    } catch (err) {
      console.log(err.message + "error")
    }
  }

  static async getPortfolioTVL(uid, name) {
    const sql = `SELECT
          pa.uid = $1,
          pa.portfolio_name = $2,
          SUM(pa.amount * COALESCE(ca.latest_price, sa.latest_price)) AS total_usd_value
      FROM
          Portfolio_assets pa
      LEFT JOIN
          CryptoAsset ca ON pa.asset_name = ca.asset_name AND pa.asset_ticker = ca.asset_ticker
      LEFT JOIN
          StockAsset sa ON pa.asset_name = sa.asset_name AND pa.asset_ticker = sa.asset_ticker
      GROUP BY
          pa.uid, pa.portfolio_name;
      `
    return await db.queryDbValues(sql, [uid, name])
  }

  static async getTotalTVL(uid) {
    const sql = `SELECT
          pa.uid = $1,
          SUM(pa.amount * COALESCE(ca.latest_price, sa.latest_price)) AS total_usd_value
      FROM
          Portfolio_assets pa
      LEFT JOIN
          CryptoAsset ca ON pa.asset_name = ca.asset_name AND pa.asset_ticker = ca.asset_ticker
      LEFT JOIN
          StockAsset sa ON pa.asset_name = sa.asset_name AND pa.asset_ticker = sa.asset_ticker
      GROUP BY
          pa.uid;
      `

  }

  static async getAllAssets(uid) {

  }
}

module.exports = Portfolio
