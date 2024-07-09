import axios from "axios"
import UserAssetAmount from "./UserAssetAmount"

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
    coin = initialData.asset
  }
  return (
    <div className="text-black">
      {initialData ? (
        <div className=" gap-y-6 py-6 ">
          <div className="my-3">
            <div className="flex items-center">
              <img
                src={"https://s2.coinmarketcap.com/static/img/coins/128x128/" + coin.id + ".png"}
                alt="error"
                className="w-16 rounded-full"
              ></img>
              <div className="flex items-baseline">
                <h2 className="text-4xl ml-4">{coin.name}</h2>
                <h3 className="text-3xl ml-4 text-gray-500 bottom-0">{coin.symbol}</h3>
              </div>
            </div>
            <h1 className="text-6xl mt-4">${coin.quote.USD.price}</h1>
          </div>

          <div className="my-3">
            <h3 className="text-xl">Total Holdings:</h3>
            <UserAssetAmount asset_id={asset} asset_ticker={coin.symbol} />
          </div>

          {/* <h1 className="text-4xl">$60000.00</h1> */}
          {/* <p>{asset}</p> */}
          {/* <p>
            {coin.platform
              ? 
              "Chain: " +
                coin.platform.name +
                ", Address: " +
                coin.platform.token_address
              : "not a token"}
          </p> */}

          {/* <div id="chart" className="w-800px h-400px bg-orange-300 mt-20">
            chart
          </div>
          <div className="w-800px h-auto bg-orange-300 mt-4 grid md:grid-cols-6 gap-4 p-2 rounded-lg">
            <div className="text-center ">1D</div>
            <div className="text-center ">1W</div>
            <div className="text-center ">1M</div>
            <div className="text-center ">6M</div>
            <div className="text-center ">1Y</div>
            <div className="text-center ">5Y</div>
          </div> */}

          {/* <h2>
            Market Cap:{" "}
            {coin.circulating_supply
              ? coin.circulating_supply * coin.quote.USD.price
              : coin.self_reported_market_cap
              ? coin.self_reported_market_cap
              : "unknown"}
          </h2>
          <h2>
            Circulating Supply:{" "}
            {coin.circulating_supply
              ? coin.circulating_supply
              : coin.self_reported_circulating_supply
              ? coin.self_reported_circulating_supply
              : "unknown"}
          </h2>
          <h2>
            Total Supply:{" "}
            {coin.max_supply ? coin.max_supply : coin.total_supply ? coin.total_supply : "unknown"}
          </h2>
          <h2>
            Diluted Mcap{" "}
            {coin.max_supply
              ? coin.max_supply * coin.quote.USD.price
              : coin.total_supply
              ? coin.total_supply * coin.quote.USD.price
              : "unknown"}
          </h2> */}
          <div className="stats stats-vertical shadow my-3 bg-secondary text-black">
            <h2 className="stat">Stats:</h2>
            <div className="stat">
              <div className="stat-title text-primary">Market Cap</div>
              <div className="stat-value">${coin.quote.USD.market_cap}</div>
            </div>

            <div className="stat">
              <div className="stat-title text-primary">24h Volume</div>
              <div className="stat-value">${coin.quote.USD.volume_24h}</div>
            </div>

            <div className="stat">
              <div className="stat-title text-primary">Circulating Supply</div>
              <div className="stat-value">
                {coin.circulating_supply} {coin.symbol}
              </div>
            </div>
          </div>
          <div>
            <div className="my-3 btn btn-info btn-sm">
              <a target="_blank" href={"https://coinmarketcap.com/currencies/" + coin.name + "/"}>
                More info
              </a>
            </div>
          </div>

          {/* <h2>ATH</h2> */}
        </div>
      ) : (
        <div>Error fetching info</div>
      )}
    </div>
  )
}

export default Coin
