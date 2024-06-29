"use client"

import { useState } from "react"
import Settings from "./Settings"
import BarChart from "./barchart"

import FetchPortfolio from "./fetchPortfolio"
import { percentGainCalc, round } from "@/util/util"
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
    <div className="gradient-bg">
      <h1 className="m-16">Portfolio</h1>
      <div className="grid w-full grid-cols-1 lg:grid-cols-2 p-8 gap-8">
        <div className="w-full min-h-1/2 bg-white rounded-3xl">
          <BarChart assetData={data} />
        </div>
        <div className="w-full bg-white rounded-3xl">
          <div className="rounded-3xl ">
            <h2>Stats:</h2>
            <div className="grid grid-cols-2 p-4 gap-4">
              <div className="grid grid-cols-2 bg-slate-50 rounded-3xl py-2 px-4">
              <h2 className="col-span-2">Stats:</h2>
                <div>Net contibutions:</div>
                <div className="text-right">${round(contributions, 2)}</div>

                <div>Net PNL</div>
                <div className="text-right">${round(tvl - contributions, 2)}</div>
                <div>Net PNL (%)</div>
                <div className="text-right">{round(percentGainCalc(tvl, contributions), 2)}%</div>
                <div>Num. Assets</div>
                <div className="text-right">{data.length}</div>
              </div>

              {/* <div className="stats stats-vertical lg:stats-horizontal shadow text-primary bg-base-200 col-span-2"> */}
              {/* <div className="stat">
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
                </div> */}
              {/* </div> */}

              <div className="bg-slate-400 rounded-3xl py-2 px-4">Asset Class Allocations:</div>
              <div className="col-span-2 bg-slate-400 rounded-3xl py-2 px-4">
                Individual Portfolios:
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="m-8">
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
