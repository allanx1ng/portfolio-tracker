import axios from "axios"

const Coin = async ({ params }) => {
  const asset = params.coin
  const fetchAsset = async () => {
    const backendURL = "http://localhost:4321/price/coin/" + asset
    try {
      const res = await axios.get(backendURL)

      return res.data
    } catch (error) {
      return null
    }
  }
  const initialData = await fetchAsset()
  let coin
  if (initialData) {
    coin = initialData[asset.toUpperCase()]
  }
  return (
    <div className="w-screen">
      {initialData ? (
        <div className="container ml-40 mt-20">
          <div className="flex items-baseline">
            <img
              src={
                "https://s2.coinmarketcap.com/static/img/coins/200x200/" +
                coin.id +
                ".png"
              }
              alt="error"
              className="w-16"
            ></img>
            <h2 className="text-4xl ml-4">{coin.name}</h2>
            <h3 className="text-3xl ml-4 text-gray-500 bottom-0">
              {coin.symbol}
            </h3>
          </div>
          <h1 className="text-6xl mt-4">${coin.quote.USD.price}</h1>

          <h3 className="text-xl mt-8">Total Holdings:</h3>
          <h1 className="text-4xl">$60000.00</h1>
          <p>{asset}</p>
          <p>
            {coin.platform
              ? 
              "Chain: " +
                coin.platform.name +
                ", Address: " +
                coin.platform.token_address
              : "not a token"}
          </p>

          <div id="chart" className="w-800px h-400px bg-orange-300 mt-20">
            chart
          </div>
          <div className="w-800px h-auto bg-orange-300 mt-4 grid md:grid-cols-6 gap-4 p-2 rounded-lg">
            <div className="text-center ">1D</div>
            <div className="text-center ">1W</div>
            <div className="text-center ">1M</div>
            <div className="text-center ">6M</div>
            <div className="text-center ">1Y</div>
            <div className="text-center ">5Y</div>
          </div>

          <h2>Stats</h2>
          <h2>Market Cap: {coin.circulating_supply ? coin.circulating_supply * coin.quote.USD.price : coin.self_reported_market_cap ? coin.self_reported_market_cap : "unknown"}</h2>
          {/* <h2>24h Volume: {coin.}</h2> */}
          <h2>Circulating Supply: {coin.circulating_supply ? coin.circulating_supply : coin.self_reported_circulating_supply ? coin.self_reported_circulating_supply : "unknown"}</h2>
          <h2>Total Supply: {coin.max_supply ? coin.max_supply : coin.total_supply ? coin.total_supply : "unknown"}</h2>
          <h2>Diluted Mcap {coin.max_supply ? coin.max_supply * coin.quote.USD.price : coin.total_supply ? coin.total_supply * coin.quote.USD.price : "unknown"}</h2>
          {/* <h2>ATH</h2> */}
        </div>
      ) : (
        <div>Error fetching info</div>
      )}
    </div>
  )
}

export default Coin
