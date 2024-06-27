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

      if (isNaN(asset.amount)) {
        asset.amount = 0
      }
      if (isNaN(asset.price)) {
        asset.price = 0
      }

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
        res.status(204).json({})
        return
      }

      const promises = []
      // const contributionPromises = []
      // const holdingsPromises = []
      promises.push(Portfolio.getTotalTVL(uid))
      data.forEach((portfolio) => {
        promises.push(
          Portfolio.getPortfolioTVL(uid, portfolio.portfolio_name).then((res) => {
            portfolio.tvl = res
            return res
          })
        )
        promises.push(
          Portfolio.getPortfolioContributions(uid, portfolio.portfolio_name).then((res) => {
            portfolio.contributions = res
            return res
          })
        )
        promises.push(
          Portfolio.getPortfolioUniqueHoldings(uid, portfolio.portfolio_name).then((res) => {
            portfolio.holdings = res
            return res
          })
        )
      })

      const tvls = await Promise.all(promises)
      const tvl = tvls[0]
      // console.log(tvl)
      // console.log(tvls)
      // console.log(data)

      res.status(200).json({ message: "portfolio fetched for user: " + uid, data: data, tvl: tvl })
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
      CurrentPortfolioValue cpv
  ORDER BY cpv.current_value DESC;`

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
        CurrentPortfolioValue cpv
        ORDER BY cpv.current_value DESC;`

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
            tvl: tvl,
            contributions: contributions,
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
      CurrentPortfolioValue cpv
  ORDER BY cpv.current_value DESC;`

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
        CurrentPortfolioValue cpv
    ORDER BY cpv.current_value DESC;`

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
      console.log(tvl)

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

  static async deleteAssets(req, res) {
    // console.log(req)
    const uid = req.user.uid
    const name = req.body.portfolio_name
    const assets = req.body.deleteAssets
    console.log(req.body)
    const sql = `DELETE FROM Portfolio_assets WHERE uid=$1 AND portfolio_name=$2 AND asset_ticker=$3 AND asset_name=$4`
    try {
      const promises = []
      assets.forEach((asset) => {
        promises.push(db.queryDbValues(sql, [uid, name, asset.asset_ticker, asset.asset_name]))
      })
      const data = await Promise.all(promises)
      if (data.rowCount == 0) {
        // console.log(204)
        res.status(204).json({})
        return
      } else {
        // console.log(200)
        res.status(200).json({ message: "success" })
        return
      }
    } catch (err) {
      res.status(500).json({})
    }
  }

  static async updateAssets(req, res) {
    // console.log(req)
    const uid = req.user.uid
    const name = req.body.portfolio_name
    const assets = req.body.modifiedAssets
    // console.log(req.body)

    const sql = `UPDATE Portfolio_assets SET amount=$1, avg_price=$2 WHERE uid=$3 AND portfolio_name=$4 AND asset_ticker=$5 AND asset_name=$6`
    const sql2 = `DELETE FROM Portfolio_assets WHERE uid=$1 AND portfolio_name=$2 AND asset_ticker=$3 AND asset_name=$4`
    try {
      const promises = []
      assets.forEach((asset) => {
        console.log(asset)
        if (isNaN(asset.total_amount) || !asset.total_amount || asset.total_amount == 0) {
          // return res.status(500).json({message: "amount cant be 0, if you want to delete the asset, use the delete function"})
          // throw new Error

          promises.push(db.queryDbValues(sql2, [uid, name, asset.asset_ticker, asset.asset_name]))
        } else if (isNaN(asset.combined_avg_price) || !asset.combined_avg_price) {
          asset.combined_avg_price = 0
        } else {
          promises.push(
            db.queryDbValues(sql, [
              asset.total_amount,
              asset.combined_avg_price,
              uid,
              name,
              asset.asset_ticker,
              asset.asset_name,
            ])
          )
        }
      })

      const data = await Promise.all(promises)
      // console.log(data)
      if (data.rowCount == 0) {
        console.log(204)
        res.status(204).json({})
      } else {
        console.log(200)
        res.status(200).json({ message: "success" })
      }
    } catch (err) {
      res.status(500).json({})
    }
  }

  static async getSingleAsset(req, res) {
    const uid = req.user.uid
    const { asset_name, asset_ticker } = req.query

    if (!asset_name || !asset_ticker || !uid) {
      return res.status(400).json({ message: "error no user or asset specified" })
    }

    const sql = `SELECT 
        SUM(amount) AS total_amount
    FROM 
        Portfolio_assets
    WHERE 
        uid = $1 AND
        asset_name = $2 AND
        asset_ticker = $3;
    `

    try {
      const data = await db.queryDbValues(sql, [uid, asset_name, asset_ticker])
      res.status(200).json({ data: data[0].total_amount })
    } catch (err) {
      res.status(500).json({ message: err.message })
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
          pa.uid,
          SUM(pa.amount * COALESCE(ca.latest_price, sa.latest_price)) AS total_usd_value
      FROM
          Portfolio_assets pa
      LEFT JOIN
          CryptoAsset ca ON pa.asset_name = ca.asset_name AND pa.asset_ticker = ca.asset_ticker
      LEFT JOIN
          StockAsset sa ON pa.asset_name = sa.asset_name AND pa.asset_ticker = sa.asset_ticker
      WHERE
          pa.uid = $1
      GROUP BY
          pa.uid;
      `

    const data = await db.queryDbValues(sql, [uid])
    // console.log(data)
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
    if (data[0].total_contributed) {
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
    if (data[0].total_contributed) {
      return data[0].total_contributed
    } else {
      return 0
    }
  }

  static async getPortfolioUniqueHoldings(uid, name) {
    const query = `
    SELECT
        COUNT(DISTINCT pa.asset_name || '-' || pa.asset_ticker) AS unique_holdings
    FROM
        Portfolio_assets pa
    WHERE
        pa.uid = $1 AND pa.portfolio_name = $2;
  `
    const values = [uid, name]
    const data = await db.queryDbValues(query, values)
    if (data[0].unique_holdings) {
      return data[0].unique_holdings
    } else {
      return 0
    }
  }

  static async getUniqueHoldings(uid) {
    const query = `
    SELECT
        COUNT(DISTINCT pa.asset_name || '-' || pa.asset_ticker) AS unique_holdings
    FROM
        Portfolio_assets pa
    WHERE
        pa.uid = $1;
  `
    const values = [uid]
    const data = await db.queryDbValues(query, values)
    if (data[0].unique_holdings) {
      return data[0].unique_holdings
    } else {
      return 0
    }
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
