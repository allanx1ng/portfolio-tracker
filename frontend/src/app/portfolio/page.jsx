"use client"
import Settings from "./Settings"

import PieChart from "@/components/charts/PieChart"

import { percentGainCalc, round } from "@/util/util"
import ErrorCode from "@/components/ErrorCode"
import AssetTable from "@/components/tables/AssetTable"
import { usePortfolio } from "@/context/TotalAssetContext"
import { useState } from "react"
import { usePortfolios } from "@/context/PortfoliosContext"

export default function () {
  const { data, tvl, contributions, loading, error } = usePortfolio()
  const { portfolios, loadingPortfolios, errorPortfolios } = usePortfolios()
  //   console.log(data)
  const [chartDisplayState, setDisplayState] = useState("percent")
  if (loading) return <span className="loading loading-dots loading-md"></span>
  if (error) return <ErrorCode error={error} />
  return (
    <div className="">
      <h1 className="mt-8 text-black">Portfolio</h1>
      <div className="grid w-full grid-cols-1 lg:grid-cols-2 py-8 gap-8 h-600px">
        <div className="w-full min-h-1/2 bg-white rounded-3xl flex items-center justify-center col-span-2">
          {/* <BarChart assetData={data} /> */}
          <PieChart state={chartDisplayState} CenteredMetric={tvl} />
        </div>
      </div>
      <div>
        {/* <div className="stats stats-vertical lg:stats-horizontal shadow my-8 bg-secondary text-primary"> */}
        {/* <h2 className="stat">Portfolio Stats:</h2> */}
        <div className="divider divider-primary"></div>
        <div className="flex justify-start">
          <div className="stat">
            <div className="stat-title text-primary">Net contibutions:</div>
            <div className="stat-value text-3xl">${round(contributions, 2)}</div>
          </div>

          <div className="stat">
            <div className="stat-title text-primary">Net PNL</div>
            <div
              className={
                tvl - contributions >= 0
                  ? "stat-value text-3xl text-success"
                  : "stat-value text-3xl text-error"
              }
            >
              ${round(tvl - contributions, 2)}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title text-primary">Net PNL (%)</div>
            <div
              className={
                tvl - contributions >= 0
                  ? "stat-value text-3xl text-success"
                  : "stat-value text-3xl text-error"
              }
            >
              {round(percentGainCalc(tvl, contributions), 2)}%
            </div>
          </div>
        </div>
      </div>
      <div className="divider divider-primary"></div>
      {/* </div> */}

      <div className="my-8">
        {/* <FetchPortfolio
              data={data}
              setData={setData}
              setContributions={setContributions}
              setTvl={setTvl}
              setError={setError}
            /> */}
        <div className="my-8 p-8 rounded-3xl bg-secondary">
          {data.length == 0 ? (
            <ErrorCode error={204} text={"No assets currently, add some to get started"} />
          ) : (
            <>
              <AssetTable data={data} tvl={tvl} />
            </>
          )}
        </div>

        <div className="divider divider-primary"></div>

        <h2>Stats:</h2>

        <div className="grid grid-cols-4 rounded-3xl py-2 px-4 gap-x-8">
          <div>
            <div className="divider divider-secondary"></div>
            <div>Net worth:</div>
            <div className="font-bold">${round(tvl, 2)}</div>
            <div className="divider divider-secondary"></div>
          </div>
          <div>
            <div className="divider divider-secondary"></div>
            <div>Net contibutions:</div>
            <div className="font-bold">${round(contributions, 2)}</div>
            <div className="divider divider-secondary"></div>
          </div>
          <div>
            <div className="divider divider-secondary"></div>
            <div>Net PNL</div>
            <div className="">${round(tvl - contributions, 2)}</div>
            <div className="divider divider-secondary"></div>
          </div>
          <div>
            <div className="divider divider-secondary"></div>
            <div>Net PNL (%)</div>
            <div className="">{round(percentGainCalc(tvl, contributions), 2)}%</div>
            <div className="divider divider-secondary"></div>
          </div>
          <div>
            <div>Num. Assets</div>
            <div className="">{data.length}</div>
            {/* <div className="divider divider-secondary"></div> */}
          </div>
          <div>
            <div>Num. Portfolios</div>
            <div className="">{portfolios.length}</div>
            {/* <div className="divider divider-secondary"></div> */}
          </div>
        </div>

        <div className="w-full bg-white rounded-3xl h-500px">
          <div className="rounded-3xl ">
            {/* <h2>Stats:</h2> */}
            <div className="grid grid-cols-2 p-4 gap-8">
              {/* <div className="grid grid-cols-2 bg-slate-50 rounded-3xl py-2 px-4">
                <h2 className="col-span-2">Stats:</h2>
                <div>Net contibutions:</div>
                <div className="text-right">${round(contributions, 2)}</div>

                <div>Net PNL</div>
                <div className="text-right">${round(tvl - contributions, 2)}</div>
                <div>Net PNL (%)</div>
                <div className="text-right">{round(percentGainCalc(tvl, contributions), 2)}%</div>
                <div>Num. Assets</div>
                <div className="text-right">{data.length}</div>
                <div>Num. Portfolios</div>
                <div className="text-right">{portfolios.length}</div>
              </div> */}

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

              <div>
                <div className="divider divider-primary"></div>
                <div className="rounded-3xl py-2 px-4 text-xl">Asset Class Allocations:</div>
              </div>

              <div className="col-span-1 rounded-3xl ">
                <div className="divider divider-primary"></div>
                <div className="text-xl">Individual Portfolios:</div>

                <div className="grid grid-cols-2 justify-between font-bold mt-4">
                  <div>Portfolio: </div>
                  <div className="text-right">Value: </div>
                </div>
                <div>
                  {loadingPortfolios && <span className="loading loading-dots loading-md"></span>}
                  {!loadingPortfolios &&
                    portfolios.map((e, index) => (
                      <div key={index}>
                        {index == 0 && <div className="divider divider-secondary my-2"></div>}
                        <div className="grid grid-cols-2 text-primary">
                          <div>{e.portfolio_name}</div>
                          <div className="text-right">{round(e.tvl, 2)}</div>
                        </div>
                        <div className="divider divider-secondary my-2"></div>
                      </div>
                    ))}
                </div>
                <a href="/portfolios" className="btn my-4 col-span-2 btn-primary text-white">
                  View All Portfolios
                </a>
              </div>
            </div>
            <div className="divider divider-primary"></div>
          </div>
        </div>
      </div>

      <Settings />
    </div>
  )
}
