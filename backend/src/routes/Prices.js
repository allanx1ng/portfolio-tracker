const axios = require('axios');
require('dotenv').config();
const CMCapiKey = process.env.CMC_API_KEY;

class Prices {
    constructor() {
        // Initialize the price cache
        this.priceCache = {};
        this.dataCache = {};

        // Fetch prices immediately and every 5 minutes (300,000 ms)
        this.fetchAndUpdatePrices();
        setInterval(() => this.fetchAndUpdatePrices(), 300000);
    }

    async fetchAndUpdatePrices() {
        try {
            console.log('Trying request');
            const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
            const response = await axios.get(url, {
                headers: {
                    'X-CMC_PRO_API_KEY': CMCapiKey,
                },
                params: {
                    convert: 'USD',
                    limit: 50, // Adjust to the number of cryptocurrencies you want to track
                },
            });

            // Initialize or update the price cache
            const data = response.data.data;
            data.forEach((coin) => {
                this.priceCache[coin.symbol] = coin.quote.USD.price;
            });
            data.forEach((coin) => {
              this.dataCache[coin.symbol] = coin;
            })
            // console.log(data)
            // console.log('Updated Prices:', this.priceCache);
            console.log(this.dataCache);
        } catch (error) {
            console.error('Error fetching prices:', error.message);
        }
    }

    getPrice(req, res) {
        const assetReq = req.params.asset ? req.params.asset.toUpperCase() : null;
        
        if (!assetReq) {
            // Return all prices if no specific asset is requested
            res.json(this.priceCache);
        } else {
            const asset = this.priceCache[assetReq];
            if (asset !== undefined) {
                res.json({ [assetReq]: asset });
            } else {
                res.status(404).json({ error: 'Asset not found' });
            }
        }
    }
}

// Create a singleton instance of the Prices class
const pricesInstance = new Prices();

module.exports = {
    getPrice: (req, res) => pricesInstance.getPrice(req, res),
};
