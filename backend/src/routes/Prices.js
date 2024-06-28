const axios = require("axios")
require("dotenv").config()
const CMC_API_KEY = process.env.CMC_API_KEY
const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY
const POLYGON_KEY = process.env.POLYGON_KEY
const DatabaseInstance = require("../db/Database")
const db = DatabaseInstance.getInstance()

class Prices {
  constructor() {
    // Initialize the price cache
    this.db = DatabaseInstance.getInstance()
    this.priceCache = {}
    this.coinDataCache = {}
    this.stockDataCache = {}
    this.coinDataArray = []
    this.stockDataArray = []

    // Fetch prices immediately and every 5 minutes (300,000 ms)
    this.fetchAndUpdateStats()
    setInterval(() => this.fetchAndUpdateStats(), 600000);
  }

  async fetchAndUpdateStats() {
    const promises = [this.fetchAndUpdateCoinStats(), this.fetchAndUpdateStockStats()]
    Promise.all(promises).then(() => {
      console.log("updating db")
      this.updateDbStats()
    })
  }

  async updateDbStats() {
    try {
      const promises = []
      // ON CONFLICT (asset_name, asset_ticker)
      // DO UPDATE SET
      //     asset_type = EXCLUDED.asset_type,
      //     last_updated = EXCLUDED.last_updated
      const sql = `INSERT INTO Asset (asset_name, asset_ticker, asset_type)
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
      ;`
      const sql2 = `INSERT INTO CryptoAsset (asset_name, asset_ticker, cmc_id, latest_price)
      VALUES ($1, $2, $3, $4) 
      ON CONFLICT (asset_name, asset_ticker)
      DO UPDATE SET latest_price = EXCLUDED.latest_price;`

      // console.log(this.stockDataCache)
      this.coinDataArray.forEach((item) => {
        // console.log(item.name)
        const entry = this.db
          .queryDbValues(sql, [item.name, item.symbol, "coin"])
          .then((res) => {
            return this.db.queryDbValues(sql2, [
              item.name,
              item.symbol,
              item.id,
              item.quote.USD.price,
            ])
          })
          .catch((err) => {
            console.log(err)
          })
        // promises.push(entry)
      })
      // await Promise.all(promises)
    } catch (err) {
      console.log(err)
    }
  }

  async fetchAndUpdateCoinStats() {
    try {
      console.log("Trying request")
      const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
      const response = await axios.get(url, {
        headers: {
          "X-CMC_PRO_API_KEY": CMC_API_KEY,
        },
        params: {
          convert: "USD",
          limit: 500, // Adjust to the number of cryptocurrencies you want to track
        },
      })

      // Initialize or update the price cache
      const data = response.data.data
      this.coinDataArray = data
      // data.forEach((coin) => {
      //   this.priceCache[coin.name] = coin.quote.USD.price
      // })
      data.forEach((coin) => {
        this.coinDataCache[coin.name.toLowerCase()] = coin
      })
      // console.log(data)
      // console.log('Updated Prices:', this.priceCache);
      // console.log(this.coinDataCache);
    } catch (error) {
      console.error("Error fetching coin prices:", error.message)
    }
  }

  async fetchAndUpdateStockStats() {
    const tickers = ["TSLA" /* Add more tickers */]
    try {
      const fetchFundamentalData = async (ticker) => {
        const today = new Date()
        const previousDay = new Date(today)
        previousDay.setDate(today.getDate() - 1)
        const year = previousDay.getFullYear()
        const month = String(previousDay.getMonth() + 1).padStart(2, "0") // Months are zero-indexed
        const day = String(previousDay.getDate()).padStart(2, "0")
        const formattedDate = `${year}-${month}-${day}`
        console.log(formattedDate)
        // const url = `https://api.polygon.io/v2/reference/financials/${ticker}?limit=1&apiKey=${POLYGON_KEY}`;
        const url = `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${formattedDate}?adjusted=true&apiKey=${POLYGON_KEY}`
        try {
          const response = await axios.get(url)
          if (response.data.results) {
            // this.stockDataCache = response.data.results
            // console.log(response.data.result)
            for (let stock of response.data.results) {
              // console.log(stock.T)
              this.stockDataCache[stock.T] = stock
            }
          } else {
            console.log("stock fetching error")
          }
        } catch (error) {
          console.error(`Error fetching fundamental data for ${ticker}:`, error.message)
          return { ticker, error: error.message }
        }
      }
      await fetchFundamentalData(tickers)
      //   console.log(this.stockDataCache)
    } catch (error) {
      console.error("Error fetching stock prices:", error.message)
    }
  }

  getPrice(req, res) {
    const assetClass = req.params.type ? req.params.type : null
    if (!assetClass) {
      res.status(400).json({ error: "bad req" })
    }
    const assetReq = req.params.asset ? req.params.asset.toLowerCase() : null

    if (!assetReq) {
      // Return all prices if no specific asset is requested
      res.json(this.coinDataCache)
    } else {
      if (assetClass === "coin") {
        console.log(assetReq)
        console.log(this.coinDataCache[assetReq])
        const asset = this.coinDataCache[assetReq]
        if (asset !== undefined) {
          res.json({ asset: asset })
        } else {
          res.status(404).json({ error: "Asset not found" })
        }
      } else if (assetClass === "stock") {
        try {
          // console.log(this.stockDataCache)
          const asset = this.stockDataCache[assetReq.toUpperCase()]
          if (asset) {
            res.json({ [assetReq]: asset })
          } else {
            res.status(404).json({ error: "Asset not found" })
          }
        } catch (err) {
          console.log(err.message)
        }
      }
    }
  }
}

// Create a singleton instance of the Prices class
const pricesInstance = new Prices()

module.exports = {
  getPrice: (req, res) => pricesInstance.getPrice(req, res),
}
