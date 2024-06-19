"use client"
import { useState, useEffect, Fragment } from "react"
import GetPortfolio from "./getPortfolio"
import AddAssets from "./addAssets"
import Error from "./error"
import EditButton from "./EditButton"
import DeletePortfolio from "./DeletePortfolio"
import { round } from "@/util/util"
import AssetTable from "@/components/AssetTable"
import EditAssets from "./EditAssets"

export default function ({ params }) {
  const [reload, setReload] = useState(false)
  const [error, setError] = useState(false)
  const [portfolio, setPortfolio] = useState([])
  const [edit, setEdit] = useState(false)

  // const [stocks, setStocks] = useState([])
  // const [coins, setCoins] = useState([])
  const [data, setData] = useState([])
  const [sort, setSort] = useState("Value")
  const [doSort, setDoSort] = useState(false)

  useEffect(() => {
    processAssets()
  }, [portfolio])

  useEffect(() => {
    if (doSort) {
      switch (sort) {
        case "Value":
        default:
          sortData()
      }
    }
  }, [data, sort])

  const processAssets = () => {
    if (portfolio.coindata || portfolio.stockdata) {
      const tempCoins = [...portfolio.coindata]
      const tempStocks = [...portfolio.stockdata]
      const combinedData = [...tempCoins, ...tempStocks]
      setData(combinedData)
    }
  }

  const sortData = () => {
    if (data.length > 0) {
      const copyArray = [...data]
      copyArray.sort((a, b) => {
        return parseFloat(b.current_value) - parseFloat(a.current_value)
      })
      setDoSort(false)
      setData(copyArray)

      console.log(data)
    }
  }

  return error ? (
    <Error error={error} />
  ) : (
    <div className="m-8">
      {/* <ToastContainer/> */}
      <GetPortfolio
        name={params.portfolio}
        reload={reload}
        error={error}
        setError={setError}
        portfolio={portfolio}
        setPortfolio={setPortfolio}
      />

      {portfolio.length == 0 ? (
        <Error error={204} />
      ) : (
        // <div></div>
        <div>
          {/* <ToastContainer /> */}
          <h1>{portfolio.portfolio_data.portfolio_name}</h1>

          <div>Portfolio type: {portfolio.portfolio_data.account_type}</div>
          {/* <div>TVL: {portfolio.tvl}</div>
          <div>Total Contributions: {portfolio.contributions}</div> */}

          <div className="stats stats-vertical lg:stats-horizontal shadow text-primary bg-base-200">
            <div className="stat">
              <div className="stat-title">Total Value</div>
              <div className="stat-value">${round(portfolio.tvl, 2)}</div>
              <div className="stat-desc">Contributions: ${round(portfolio.contributions, 2)}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Net PNL ($)</div>
              <div className="stat-value">${round(portfolio.tvl - portfolio.contributions, 2)}</div>
              <div className="stat-desc"></div>
            </div>

            <div className="stat">
              <div className="stat-title">Net PNL (%)</div>
              <div className="stat-value">
                {round((portfolio.tvl / portfolio.contributions - 1) * 100, 2)}%
              </div>
              <div className="stat-desc"></div>
            </div>
          </div>

          <h2 className="mt-4">Assets:</h2>
          {/* {edit
            ? portfolio.assets.map((asset) => (
                <div key={asset.asset_ticker}>
                  {asset.asset_name} {parseFloat(asset.amount).toFixed(2)}{" "}
                  {parseFloat(asset.avg_price).toFixed(2)}{" "}
                  <button
                    className="rounded-full border-2 border-red-500 w-4 h-4"
                  >
                    -
                  </button>
                </div>
              ))
            : portfolio.assets.map((asset) => (
                <div key={asset.asset_ticker}>
                  {asset.asset_name} {parseFloat(asset.amount).toFixed(2)}{" "}
                  {parseFloat(asset.avg_price).toFixed(2)}
                </div>
              ))} */}

          {/* <div className="grid grid-cols-7 text-gray-600 text-sm font-light">
            {data.map((holding, index) => (
              <Fragment key={index}>
                <div className="py-3 px-6 text-left whitespace-nowrap">
                  <a href={"asset/coin/" + holding.asset_ticker}>{holding.asset_name}</a>
                </div>
                <div className="py-3 px-6 text-left">
                  {round((holding.current_value / portfolio.tvl) * 100, 2) + "%"}
                </div>
                <div className="py-3 px-6 text-center">{round(holding.current_value, 2)}</div>
                <div className="py-3 px-6 text-center">{round(holding.total_amount, 2)}</div>
                <div className="py-3 px-6 text-center">{round(holding.current_price, 2)}</div>
                <div className="py-3 px-6 text-center">{round(holding.combined_avg_price, 2)}</div>
                <div className="py-3 px-6 text-right flex justify-center space-x-1">
                  <span>
                    {round((holding.current_value / holding.total_contributed - 1) * 100, 2) + "%"}
                  </span>
                  <span>/</span>
                  <span className="text-green-500">
                    {"$" + round(holding.current_value - holding.total_contributed, 2)}
                  </span>
                </div>
              </Fragment>
            ))}
          </div> */}

          {edit ? (
            <EditAssets
              data={data}
              setReload={setReload}
              portfolio_name={params.portfolio}
              setEdit={setEdit}
            />
          ) : (
            <AssetTable data={data} tvl={portfolio.tvl} />
          )}
        </div>
      )}
      <>
        <h2>Other actions: </h2>
        <div className="grid grid-cols-fixed gap-4 justify-items-left w-1/2 my-2">
          <EditButton setEdit={setEdit} edit={edit} className="w-200px" />
          <AddAssets name={params.portfolio} setReload={setReload} className="w-200px" />
          <DeletePortfolio name={params.portfolio} className="w-200px" />
        </div>
      </>
    </div>
  )
}
