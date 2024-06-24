"use client"

import { useState } from "react"
import Settings from "./Settings"
import BarChart from "./barchart"

import FetchPortfolio from "./fetchPortfolio"
import { round } from "@/util/util"
import ErrorCode from "@/components/ErrorCode"
import AssetTable from "@/components/tables/AssetTable"

const Portfolio = () => {
  const [data, setData] = useState([])

  const [tvl, setTvl] = useState(0)
  const [contributions, setContributions] = useState(0)
  const [error, setError] = useState(null)

  // const [stocks, setStocks] = useState([])
  // const [coins, setCoins] = useState([])

  return error ? (
    <ErrorCode error={error} />
  ) : (
    <div>
      <h1 className="m-16">Portfolio</h1>
      <div className="m-24 w-1/2 min-h-1/2 ">
        <BarChart assetData={data} />
      </div>
      <div className="m-8">
        <div className="stats stats-vertical lg:stats-horizontal shadow text-primary bg-base-200">
          <div className="stat">
            <div className="stat-title">Total Value</div>
            <div className="stat-value">${round(tvl, 2)}</div>
            <div className="stat-desc">Contributions: ${round(contributions, 2)}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Net PNL ($)</div>
            <div className="stat-value">${round(tvl - contributions, 2)}</div>
            <div className="stat-desc"></div>
          </div>

          <div className="stat">
            <div className="stat-title">Net PNL (%)</div>
            <div className="stat-value">{round((tvl / contributions - 1) * 100, 2)}%</div>
            <div className="stat-desc"></div>
          </div>
        </div>

        <h1 className="mt-8">All assets:</h1>
        <FetchPortfolio
          data={data}
          setData={setData}
          setContributions={setContributions}
          setTvl={setTvl}
          setError={setError}
        />
        <div className="my-8">
          {data.length == 0 ? (
            <ErrorCode error={204} text={"No assets currently, add some to get started"} />
          ) : (
            <>
              <AssetTable data={data} tvl={tvl} />
            </>
          )}
        </div>
      </div>

      <a href="/portfolios" className="btn m-8">
        View individual portfolios
      </a>

      <Settings />
    </div>
  )
}

export default Portfolio
