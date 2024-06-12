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
    const query = "SELECT * FROM portfolio WHERE uid = $1"
    try {
      //   const sql = "SELECT uid FROM UserAccount WHERE email = $1;"
      //   const uid = await db.queryDbValues(sql, [user])
      const data = await db.queryDbValues(query, [uid])
      console.log(data)

      if (data.length == 0) {
        res.status(204)
        return
      }

      const promises = []
      data.forEach((portfolio) => {
        promises.push(
          Portfolio.getPortfolioTVL(uid, portfolio.portfolio_name).then((res) => {
            portfolio.tvl = res
            return res
          })
        )
      })

      const tvls = await Promise.all(promises)
      // console.log(tvls)
      // console.log(data)

      res.status(200).json({ message: "portfolio fetched for user: " + uid, data: data })
    } catch (err) {
      res.status(500).json({ error: err })
    }
  }

  static async getPortfolio(req, res) {
    const user = req.user.email
    const uid = req.user.uid
    const name = req.params.name

    const query = "SELECT * FROM portfolio WHERE uid = $1 AND portfolio_name = $2"

    const cryptoSQL = `WITH CombinedAssets AS (
      SELECT
          pa.asset_name,
          pa.asset_ticker,
          SUM(pa.amount) AS total_amount,
          SUM(pa.amount * pa.avg_price) AS total_contributed,
          SUM(pa.amount * pa.avg_price) / SUM(pa.amount) AS combined_avg_price
      FROM
          Portfolio_assets pa
      WHERE
          pa.uid = $1
          AND pa.portfolio_name = $2
      GROUP BY
          pa.asset_name, pa.asset_ticker
  ),
  CurrentPortfolioValue AS (
      SELECT
          ca.asset_name,
          ca.asset_ticker,
          ca.total_amount,
          ca.total_contributed,
          ca.combined_avg_price,
          cr.cmc_id,
          cr.latest_price AS current_price,
          ca.total_amount * cr.latest_price AS current_value
      FROM
          CombinedAssets ca
      INNER JOIN
          CryptoAsset cr ON ca.asset_name = cr.asset_name AND ca.asset_ticker = cr.asset_ticker
  )
  SELECT
      cpv.asset_name,
      cpv.asset_ticker,
      cpv.total_amount,
      cpv.total_contributed,
      cpv.combined_avg_price,
      cpv.current_value,
      cpv.current_price,
      cpv.cmc_id
  FROM
      CurrentPortfolioValue cpv;`

    const stockSQL = `WITH CombinedAssets AS (
        SELECT
            pa.asset_name,
            pa.asset_ticker,
            SUM(pa.amount) AS total_amount,
            SUM(pa.amount * pa.avg_price) AS total_contributed,
            SUM(pa.amount * pa.avg_price) / SUM(pa.amount) AS combined_avg_price
        FROM
            Portfolio_assets pa
        WHERE
            pa.uid = $1
            AND pa.portfolio_name = $2
        GROUP BY
            pa.asset_name, pa.asset_ticker
    ),
    CurrentPortfolioValue AS (
        SELECT
            ca.asset_name,
            ca.asset_ticker,
            ca.total_amount,
            ca.total_contributed,
            ca.combined_avg_price,
            st.latest_price AS current_price,
            ca.total_amount * st.latest_price AS current_value
        FROM
            CombinedAssets ca
        INNER JOIN
          StockAsset st ON ca.asset_name = st.asset_name AND ca.asset_ticker = st.asset_ticker
    )
    SELECT
        cpv.asset_name,
        cpv.asset_ticker,
        cpv.total_amount,
        cpv.total_contributed,
        cpv.combined_avg_price,
        cpv.current_value,
        cpv.current_price
    FROM
        CurrentPortfolioValue cpv;`

    try {
      //   const sql = "SELECT uid FROM UserAccount WHERE email = $1;"
      //   const uid = await db.queryDbValues(sql, [user])
      const data = await db.queryDbValues(query, [uid, name])
      if (data.length === 0) {
        res.status(404).json({ message: " no portfolio with name: " + name + " for user: " + user })
      } else {
        const promises = []
        // promises.push(Portfolio.getAssets(uid, name))
        promises.push(db.queryDbValues(cryptoSQL, [uid, name]))
        promises.push(db.queryDbValues(stockSQL, [uid, name]))
        promises.push(Portfolio.getPortfolioTVL(uid, name))
        promises.push(Portfolio.getPortfolioContributions(uid, name))
        const [coins, stocks, tvl, contributions] = await Promise.all(promises)
        // console.log(contributions)
        // console.log(coins)
        // const query2 = "SELECT * FROM portfolio_assets WHERE uid = $1 AND portfolio_name=$2"
        // const assets = await db.queryDbValues(query2, [uid, name])
        // console.log(assets)
        if (coins.length === 0 && stocks.length == 0) {
          res.status(204).json({ message: "no assets in this portfolio" })
          return
        }
        const roundedTVL = Portfolio.round(tvl, 2)
        const roundedContributions = Portfolio.round(contributions, 2)
        // console.log(rounded)
        res.status(200).json({
          message: "portfolio fetched for user: " + uid,
          data: {
            portfolio_data: data[0],
            coindata: coins,
            stockdata: stocks,
            tvl: roundedTVL,
            contributions: roundedContributions,
          },
        })
      }
    } catch (err) {
      res.status(500).json({ error: err })
    }
  }

  static async getAllAssets(req, res) {
    const uid = req.user.uid
    const sql = `
    WITH CombinedAssets AS (
      SELECT
          pa.asset_name,
          pa.asset_ticker,
          SUM(pa.amount) AS total_amount,
          SUM(pa.amount * pa.avg_price) AS total_contributed,
          SUM(pa.amount * pa.avg_price) / SUM(pa.amount) AS combined_avg_price
      FROM
          Portfolio_assets pa
      WHERE
          pa.uid = $1
      GROUP BY
          pa.asset_name, pa.asset_ticker
  ),
  CurrentPortfolioValue AS (
      SELECT
          ca.asset_name,
          ca.asset_ticker,
          ca.total_amount,
          ca.total_contributed,
          ca.combined_avg_price,
          COALESCE(cr.latest_price, st.latest_price) AS current_price,
          COALESCE(ca.total_amount * cr.latest_price, ca.total_amount * st.latest_price) AS current_value
      FROM
          CombinedAssets ca
      LEFT JOIN
          CryptoAsset cr ON ca.asset_name = cr.asset_name AND ca.asset_ticker = cr.asset_ticker
      LEFT JOIN
          StockAsset st ON ca.asset_name = st.asset_name AND ca.asset_ticker = st.asset_ticker
  )
  SELECT
      cpv.asset_name,
      cpv.asset_ticker,
      cpv.total_amount,
      cpv.total_contributed,
      cpv.combined_avg_price,
      cpv.current_value,
      cpv.current_price
  FROM
      CurrentPortfolioValue cpv;
  
    
    `

    const cryptoSQL = `WITH CombinedAssets AS (
      SELECT
          pa.asset_name,
          pa.asset_ticker,
          SUM(pa.amount) AS total_amount,
          SUM(pa.amount * pa.avg_price) AS total_contributed,
          SUM(pa.amount * pa.avg_price) / SUM(pa.amount) AS combined_avg_price
      FROM
          Portfolio_assets pa
      WHERE
          pa.uid = $1
      GROUP BY
          pa.asset_name, pa.asset_ticker
  ),
  CurrentPortfolioValue AS (
      SELECT
          ca.asset_name,
          ca.asset_ticker,
          ca.total_amount,
          ca.total_contributed,
          ca.combined_avg_price,
          cr.cmc_id,
          cr.latest_price AS current_price,
          ca.total_amount * cr.latest_price AS current_value
      FROM
          CombinedAssets ca
      INNER JOIN
          CryptoAsset cr ON ca.asset_name = cr.asset_name AND ca.asset_ticker = cr.asset_ticker
  )
  SELECT
      cpv.asset_name,
      cpv.asset_ticker,
      cpv.total_amount,
      cpv.total_contributed,
      cpv.combined_avg_price,
      cpv.current_value,
      cpv.current_price,
      cpv.cmc_id
  FROM
      CurrentPortfolioValue cpv;`

    const stockSQL = `WITH CombinedAssets AS (
        SELECT
            pa.asset_name,
            pa.asset_ticker,
            SUM(pa.amount) AS total_amount,
            SUM(pa.amount * pa.avg_price) AS total_contributed,
            SUM(pa.amount * pa.avg_price) / SUM(pa.amount) AS combined_avg_price
        FROM
            Portfolio_assets pa
        WHERE
            pa.uid = $1
        GROUP BY
            pa.asset_name, pa.asset_ticker
    ),
    CurrentPortfolioValue AS (
        SELECT
            ca.asset_name,
            ca.asset_ticker,
            ca.total_amount,
            ca.total_contributed,
            ca.combined_avg_price,
            st.latest_price AS current_price,
            ca.total_amount * st.latest_price AS current_value
        FROM
            CombinedAssets ca
        INNER JOIN
          StockAsset st ON ca.asset_name = st.asset_name AND ca.asset_ticker = st.asset_ticker
    )
    SELECT
        cpv.asset_name,
        cpv.asset_ticker,
        cpv.total_amount,
        cpv.total_contributed,
        cpv.combined_avg_price,
        cpv.current_value,
        cpv.current_price
    FROM
        CurrentPortfolioValue cpv;`

    try {
      const promises = []
      // promises.push(db.queryDbValues(sql, [uid]))
      promises.push(db.queryDbValues(cryptoSQL, [uid]))
      promises.push(db.queryDbValues(stockSQL, [uid]))
      promises.push(Portfolio.getTotalTVL(uid))
      promises.push(Portfolio.getTotalContributions(uid))
      // promises.push(Portfolio.getUniqueHoldings(uid))
      // const [data, tvl, total_contributions, numHoldings] = await Promise.all(promises)
      // console.log(data)

      // res.status(200).json({
      //   data: data,
      //   tvl: tvl[0].total_usd_value,
      //   total_contributions: total_contributions,
      //   numHoldings: numHoldings,
      // })

      const [coindata, stockdata, tvl, total_contributions] = await Promise.all(promises)

      if (stockdata.length == 0 && coindata.length == 0) {
        res.status(204)
        console.log(204)
        return
      }

      res.status(200).json({
        coindata: coindata,
        stockdata: stockdata,
        tvl: tvl,
        total_contributions: total_contributions,
        // numHoldings: numHoldings,
      })
    } catch (err) {
      res.status(500).json({ message: err })
    }
  }

  /*
  
  ----------------------------- UTIL FUNCTIONS BELOW ------------------------------------

  */

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
      WHERE
          pa.uid = $1 AND pa.portfolio_name = $2
      GROUP BY
          pa.uid, pa.portfolio_name;
      `
    const data = await db.queryDbValues(sql, [uid, name])

    if (data.length == 1) {
      return data[0].total_usd_value
    } else {
      return 0
    }
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

    const data = await db.queryDbValues(sql, [uid])
    if (data.length == 1) {
      return data[0].total_usd_value
    } else {
      return 0
    }
  }

  static async getPortfolioContributions(uid, name) {
    const sql = `SELECT
          SUM(pa.amount * pa.avg_price) AS total_contributed
      FROM
          Portfolio_assets pa
      WHERE
          pa.uid = $1 AND pa.portfolio_name = $2;
      `
    const data = await db.queryDbValues(sql, [uid, name])
    if (data.length == 1) {
      return data[0].total_contributed
    } else {
      return 0
    }
  }

  static async getTotalContributions(uid) {
    const sql = `SELECT
        SUM(pa.amount * pa.avg_price) AS total_contributed
    FROM
        Portfolio_assets pa
    WHERE
        pa.uid = $1;
    `
    const data = await db.queryDbValues(sql, [uid])
    if (data.length == 1) {
      return data[0].total_contributed
    } else {
      return 0
    }
  }

  static async getPortfolioUniqueHoldings(uid, name) {
    const query = `
    SELECT
        COUNT(DISTINCT pa.asset_name, pa.asset_ticker) AS unique_holdings
    FROM
        Portfolio_assets pa
    WHERE
        pa.uid = $1 AND pa.portfolio_name = $2;
  `
    const values = [uid, name]
    return await db.queryDbValues(query, values)
  }

  static async getUniqueHoldings(uid) {
    const query = `
    SELECT
        COUNT(DISTINCT pa.asset_name, pa.asset_ticker) AS unique_holdings
    FROM
        Portfolio_assets pa
    WHERE
        pa.uid = $1;
  `
    const values = [uid]

    return await db.queryDbValues(query, values)
  }

  static round(num, maxDecimals) {
    // Convert the number to a string
    let numStr = num.toString()

    // Find the position of the decimal point
    let decimalIndex = numStr.indexOf(".")

    // If there is no decimal point, the number is an integer
    if (decimalIndex === -1) {
      return num
    }

    // Check the number of decimal places
    let decimalPlaces = numStr.length - decimalIndex - 1

    // If the number of decimal places exceeds the maximum, round it
    if (decimalPlaces > maxDecimals) {
      return Math.round(num * 10 ** maxDecimals) / 10 ** maxDecimals
    }

    // If the number of decimal places is within the limit, return the original number
    return num
  }
}

module.exports = Portfolio
