"use client"

import { useState } from "react"
import Settings from "./Settings"
import BarChart from "./barchart"

import FetchPortfolio from "./fetchPortfolio"
import { round } from "@/util/util"

const Portfolio = () => {
  const holdings = [
    {
      asset: "Bitcoin",
      portfolioPercentage: "66%",
      totalValue: "$21312",
      amount: "1.2 BTC",
      currentPrice: "$20,000",
      allTimeGains: "50%",
      gainsAmount: "$12000",
    },
    {
      asset: "TSLA",
      portfolioPercentage: "20%",
      totalValue: "$21312",
      amount: "1.2 BTC",
      currentPrice: "$20,000",
      allTimeGains: "50%",
      gainsAmount: "$12000",
    },
  ]

  const [data, setData] = useState([])

  const [tvl, setTvl] = useState(0)
  const [contributions, setContributions] = useState(0)
  return (
    <div>
      <div className="m-24 w-1/2 min-h-1/2 ">
        <BarChart assetData={data} />
      </div>
      <div>
       

        <div className="stats stats-vertical lg:stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Total Value</div>
            <div className="stat-value">${round(tvl,2)}</div>
            <div className="stat-desc">Contributions: ${round(contributions,2)}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Net PNL ($)</div>
            <div className="stat-value">${round((tvl - contributions), 2)}</div>
            <div className="stat-desc"></div>
          </div>

          <div className="stat">
            <div className="stat-title">Net PNL (%)</div>
            <div className="stat-value">{round((tvl/contributions - 1)*100, 2)}%</div>
            <div className="stat-desc"></div>
          </div>
        </div>

        <a href="/portfolios">individual portfolios</a>

        <h1>All holdings</h1>
        <FetchPortfolio data={data} setData={setData} setContributions={setContributions} setTvl={setTvl} tvl={tvl} contributions={contributions} />
      </div>

      <Settings />
    </div>
  )
}

export default Portfolio
