"use client"
import { useState, Fragment } from "react"
import { percentGainCalc, percentPortfolioCalc, round } from "@/util/util"
import SortData from "@/components/tables/SortData"

export default function ({ data, tvl }) {
  const [displayData, setDisplayData] = useState([])
  return (
    <>
      <SortData data={data} displayData={displayData} setDisplayData={setDisplayData} />
      <div className="overflow-x-auto transition-opacity duration-300 ease-in-out">
        <div className="min-w-screen bg-base-200 shadow-md rounded my-6 pt-3">
          <div className="grid grid-cols-7 uppercase text-sm leading-normal h-10">
            <div className="py-3 px-6 text-center">Asset</div>
            <div className="py-3 px-6 text-center">% of portfolio</div>
            <div className="py-3 px-6 text-center">Total Value</div>
            <div className="py-3 px-6 text-center">Amount</div>
            <div className="py-3 px-6 text-center">Current Price</div>
            <div className="py-3 px-6 text-center">Avg Buy Price</div>
            <div className="py-3 px-6 text-center">All time gainz</div>
          </div>
          <div className="grid grid-cols-7 text-sm font-light py-3">
            {displayData.map((holding, index) => (
              <Fragment key={index}>
                <div className="py-3 px-6 h-10 text-center whitespace-nowrap flex items-center justify-center">
                  <a href={"/asset/coin/" + holding.asset_name} className="kbd max-w-full">
                    <div className="truncate">{holding.asset_name}</div>
                  </a>
                </div>
                <div className="py-3 px-6 h-10 text-center">
                  {round(percentPortfolioCalc(holding.current_value, tvl), 2) + "%"}
                </div>
                <div className="py-3 px-6 h-10 text-center">${round(holding.current_value, 2)}</div>
                <div className="py-3 px-6 h-10 text-center">
                  {round(holding.total_amount, 2)}
                  {` ${holding.asset_ticker}`}
                </div>
                <div className="py-3 px-6 h-10 text-center">${round(holding.current_price, 2)}</div>
                <div className="py-3 px-6 h-10 text-center">
                  {round(holding.combined_avg_price, 2)}
                </div>
                <div className="py-3 px-6 h-10 text-center flex justify-center space-x-1">
                  <span
                    className={
                      holding.current_value - holding.total_contributed > 0
                        ? "text-success"
                        : "text-error"
                    }
                  >
                    {round(percentGainCalc(holding.current_value, holding.total_contributed), 2) +
                      "%"}
                  </span>
                  <span>/</span>
                  <span
                    className={
                      holding.current_value - holding.total_contributed > 0
                        ? "text-success"
                        : "text-error"
                    }
                  >
                    {"$" + round(holding.current_value - holding.total_contributed, 2)}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
