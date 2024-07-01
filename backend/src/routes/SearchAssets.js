const DatabaseInstance = require("../db/Database")
const Prices = require("./Prices")
const db = DatabaseInstance.getInstance()
require("dotenv").config()

class SearchAssets {
  static async search(req, res) {
    // const assets = {
    //     stocks: [
    //         {
    //             name: "Tesla",
    //             ticker: "tsla"
    //         },
    //         {
    //             name: "Apple",
    //             ticker: "aapl"
    //         },
    //         {
    //             name: "Microsoft",
    //             ticker: "msft"
    //         }

    //     ],
    //     coins: [
    //         {
    //             name: "Bitcoin",
    //             ticker: "btc"
    //         },
    //         {
    //             name: "Ethereum",
    //             ticker: "eth"
    //         }
    //     ]
    // }
    const sql = `SELECT asset_id as id, asset_name as name, asset_ticker as ticker, asset_type as type FROM asset`
  
    
    const searchAssets = async (term) => {
      const lowercasedTerm = term.toLowerCase()
      
      const assets = await db.queryDbValues(sql, [])
      console.log(lowercasedTerm)
      console.log(assets)
      
      const stocks = assets.filter(
        (asset) =>
          (asset.name.toLowerCase().includes(lowercasedTerm) ||
          asset.ticker.toLowerCase().includes(lowercasedTerm)) &&
          asset.type == 'stock'
      )
      const coins = assets.filter(
        (asset) =>
          (asset.name.toLowerCase().includes(lowercasedTerm) ||
          asset.ticker.toLowerCase().includes(lowercasedTerm)) &&
          asset.type == 'coin'
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
