"use client"
import { useState, useEffect, Fragment } from "react"
import GetPortfolio from "./getPortfolio"
import AddAssets from "./addAssets"
import Error from "./error"
import EditButton from "./EditButton"
import DeletePortfolio from "./DeletePortfolio"
import { round } from "@/util/util"
import AssetTable from "@/components/tables/AssetTable"
import EditAssets from "./EditAssets"
import AddAssetButton from "./AddAssetButton"
import ErrorCode from "@/components/ErrorCode"
import PieChart from "@/components/charts/PieChart"

export default function ({ params }) {
  const [reload, setReload] = useState(false)
  const [error, setError] = useState(false)
  const [portfolio, setPortfolio] = useState([])
  const [edit, setEdit] = useState(false)
  const [addAsset, setAddAsset] = useState(false)

  // const [stocks, setStocks] = useState([])
  // const [coins, setCoins] = useState([])
  const [data, setData] = useState([])

  useEffect(() => {
    // console.log("processing assets")
    processAssets()
  }, [portfolio])

  // useEffect(() => {
  //   if (doSort) {
  //     switch (sort) {
  //       case "Value":
  //       default:
  //         sortData()
  //     }
  //   }
  // }, [data, sort])

  const processAssets = () => {
    if (portfolio.coindata || portfolio.stockdata) {
      const tempCoins = [...portfolio.coindata]
      const tempStocks = [...portfolio.stockdata]
      const combinedData = [...tempCoins, ...tempStocks]
      // console.log(combinedData)
      setData(combinedData)
    }
  }

  // const sortData = () => {
  //   if (data.length > 0) {
  //     const copyArray = [...data]
  //     copyArray.sort((a, b) => {
  //       return parseFloat(b.current_value) - parseFloat(a.current_value)
  //     })
  //     setDoSort(false)
  //     setData(copyArray)

  //     console.log(data)
  //   }
  // }

  return (
    <div className="p-8 bg-primary text-white">
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

          {/* <PieChart data={data}/> */}

          <div className="stats stats-vertical lg:stats-horizontal shadow text-primary bg-secondary">
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

          <div className="relative">
            {edit && (
              <div className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-100">
                <EditAssets
                  data={data}
                  setReload={setReload}
                  portfolio_name={params.portfolio}
                  setEdit={setEdit}
                />
              </div>
            )}
            <div
              className={`transition-opacity duration-300 ease-in-out ${
                edit ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="my-8">
                {data.length == 0 ? (
                  <ErrorCode error={204} text={"No assets currently, add some to get started"} />
                ) : (
                  <>
                    <AssetTable data={data} tvl={portfolio.tvl} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <>
        <div className="flex flex-col w-full">
          <div className="divider divider-secondary">Other Actions</div>
        </div>
        <div className="flex gap-4 justify-items-left py-4 bg-white justify-center rounded-3xl">
          {/* <div> */}
          <AddAssetButton toggleVisiblity={setAddAsset} visibility={addAsset} className="w-200px" />
          <EditButton setEdit={setEdit} edit={edit} className="w-200px" />
          <DeletePortfolio name={params.portfolio} className="w-200px" />
        </div>
        <AddAssets
          name={params.portfolio}
          setReload={setReload}
          visible={addAsset}
          className="w-200px"
        />
      </>
    </div>
  )
}
