const axios = require("axios")
require("dotenv").config()
const CMC_API_KEY = process.env.CMC_API_KEY
const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY
const POLYGON_KEY = process.env.POLYGON_KEY

class Prices {
  constructor() {
    // Initialize the price cache
    this.priceCache = {}
    this.coinDataCache = {}
    this.stockDataCache = {}

    // Fetch prices immediately and every 5 minutes (300,000 ms)
    // this.fetchAndUpdateCoinStats()
    // this.fetchAndUpdateStockStats()
    // setInterval(() => this.fetchAndUpdateStats(), 300000);
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
      data.forEach((coin) => {
        this.priceCache[coin.symbol] = coin.quote.USD.price
      })
      data.forEach((coin) => {
        this.coinDataCache[coin.symbol] = coin
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
          this.stockDataCache = response.data.results
        } catch (error) {
          console.error(`Error fetching fundamental data for ${ticker}:`, error)
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
    const assetReq = req.params.asset ? req.params.asset.toUpperCase() : null

    if (!assetReq) {
      // Return all prices if no specific asset is requested
      res.json(this.coinDataCache)
    } else {
      if (assetClass === "coin") {
        const asset = this.coinDataCache[assetReq]
        if (asset !== undefined) {
          res.json({ [assetReq]: asset })
        } else {
          res.status(404).json({ error: "Asset not found" })
        }
      } else if (assetClass === "stock") {
        const asset = this.stockDataCache.find(item => item.T === assetReq)
        if (asset) {
          res.json({ [assetReq]: asset })
        } else {
          res.status(404).json({ error: "Asset not found" })
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
