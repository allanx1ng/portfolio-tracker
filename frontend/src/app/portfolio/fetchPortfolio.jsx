"use client"

import { useEffect, useState } from "react"
import apiClient from "@/util/apiClient"
import { errorMsg } from "@/util/toastNotifications"
// import { Fragment } from "react"
import { round } from "@/util/util"
import AssetTable from "@/components/AssetTable"

export default function ({ data, setData }) {
  // const [data, setData] = useState([])
  const [stocks, setStocks] = useState([])
  const [coins, setCoins] = useState([])
  const [tvl, setTvl] = useState(0)
  const [contributions, setContributions] = useState(0)
  const [sort, setSort] = useState("Value")
  const [doSort, setDoSort] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (doSort) {
      switch (sort) {
        case "Value":
        default:
          sortData()
      }
    }
  }, [data, sort])

  useEffect(() => {
    fetchPortfolio()
  }, [])

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

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get("/portfolio-all")
      console.log(response)
      if (response.status == 200) {
        setDoSort(true)
        setTvl(response.data.tvl)
        setContributions(response.data.total_contributions)
        processAssets(response.data)
      } else if (response.status == 204) {
        console.log("no assets found")
      } else {
        // errorMsg(err)
        console.log("error fetching data")
      }
    } catch (err) {
      console.log("error fetching data")
      // errorMsg(err)
    } finally {
      setLoading(false)
    }
  }

  const processAssets = (data) => {
    const tempCoins = [...data.coindata]
    const tempStocks = [...data.stockdata]
    const combinedData = [...tempCoins, ...tempStocks]
    setData(combinedData)
  }

  return loading ? (
    <div>loading</div>
  ) : (
    <div className="mb-24">
      {data.length == 0 ? (
        <div>no assets found, add some to get started</div>
      ) : (
        <>
          <div>TVL: {round(tvl, 2)}</div>
          <div>Contributions: {round(contributions, 2)}</div>
          <div>
            Total PNL:{" "}
            <>
              <span className={tvl - contributions > 0 ? "text-green-500" : "text-red-500"}>
                {round(tvl, 2) - round(contributions, 2)}
              </span>
              <span> / </span>
              <span className={tvl - contributions > 0 ? "text-green-500" : "text-red-500"}>
                {round((tvl / contributions - 1) * 100, 2)}%
              </span>
            </>
          </div>
          {/* <div className="overflow-x-auto">
            <div className="min-w-screen bg-white shadow-md rounded my-6"> */}
          {/* Use grid layout for equal width columns */}
          {/* <div className="grid grid-cols-7 text-gray-600 uppercase text-sm leading-normal">
                <div className="py-3 px-6 text-left">Asset</div>
                <div className="py-3 px-6 text-left">% of portfolio</div>
                <div className="py-3 px-6 text-center">Total Value</div>
                <div className="py-3 px-6 text-center">Amount</div>
                <div className="py-3 px-6 text-center">Current Price</div>
                <div className="py-3 px-6 text-center">Avg Buy Price</div>
                <div className="py-3 px-6 text-right">All time gainz</div>
              </div> */}

          <AssetTable data={data} tvl={tvl} />

          {/* <div className="grid grid-cols-7 text-gray-600 text-sm font-light">
                {data.map((holding, index) => (
                  <Fragment key={index}>
                    <div className="py-3 px-6 text-left whitespace-nowrap">
                      <a href={"asset/coin/" + holding.asset_ticker}>{holding.asset_name}</a>
                    </div>
                    <div className="py-3 px-6 text-left">
                      {round((holding.current_value / tvl) * 100, 2) + "%"}
                    </div>
                    <div className="py-3 px-6 text-center">{round(holding.current_value, 2)}</div>
                    <div className="py-3 px-6 text-center">{round(holding.total_amount, 2)}</div>
                    <div className="py-3 px-6 text-center">{round(holding.current_price, 2)}</div>
                    <div className="py-3 px-6 text-center">
                      {round(holding.combined_avg_price, 2)}
                    </div>
                    <div className="py-3 px-6 text-right flex justify-center space-x-1">
                      <span>
                        {round((holding.current_value / holding.total_contributed - 1) * 100, 2) +
                          "%"}
                      </span>
                      <span>/</span>
                      <span className="text-green-500">
                        {"$" + round(holding.current_value - holding.total_contributed, 2)}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div> */}
          {/* </div>
          </div> */}
        </>
      )}
    </div>
  )
}
