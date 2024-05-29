const DatabaseInstance = require("../db/Database")
const Prices = require("./Prices")
const db = DatabaseInstance.getInstance()
require("dotenv").config()

class SearchAssets {
  static async search(req, res) {
    const assets = {
        stocks: [
            {
                name: "Tesla",
                ticker: "tsla"
            },
            {
                name: "Apple",
                ticker: "aapl"
            },
            {
                name: "Microsoft",
                ticker: "msft"
            }

        ],
        coins: [
            {
                name: "Bitcoin",
                ticker: "btc"
            },
            {
                name: "Ethereum",
                ticker: "eth"
            }
        ]
    }
    const searchAssets = async (term) => {
      const lowercasedTerm = term.toLowerCase()
      const stocks = assets.stocks.filter(
        (asset) =>
          asset.name.toLowerCase().includes(lowercasedTerm) ||
          asset.ticker.toLowerCase().includes(lowercasedTerm)
      )
      const coins = assets.coins.filter(
        (asset) =>
          asset.name.toLowerCase().includes(lowercasedTerm) ||
          asset.ticker.toLowerCase().includes(lowercasedTerm)
      )


    
      return {stocks: stocks, coins: coins}
    }
    const term = req.query.query // Use req.query to get the search term from the query string
    if (!term) {
      return res.status(400).json({ error: "Query parameter is required" })
    }
    const results = await searchAssets(term)
    console.log(results)
    res.json(results)
  }
}

module.exports = SearchAssets
