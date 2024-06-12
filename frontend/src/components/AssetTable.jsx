"use client"
import { Fragment } from "react"
import { round } from "@/util/util"

export default function ({ data, tvl }) {
  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-screen bg-white shadow-md rounded my-6">
          <div className="grid grid-cols-7 text-gray-600 uppercase text-sm leading-normal">
            <div className="py-3 px-6 text-left">Asset</div>
            <div className="py-3 px-6 text-left">% of portfolio</div>
            <div className="py-3 px-6 text-center">Total Value</div>
            <div className="py-3 px-6 text-center">Amount</div>
            <div className="py-3 px-6 text-center">Current Price</div>
            <div className="py-3 px-6 text-center">Avg Buy Price</div>
            <div className="py-3 px-6 text-right">All time gainz</div>
          </div>
          <div className="grid grid-cols-7 text-gray-600 text-sm font-light">
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
                <div className="py-3 px-6 text-center">{round(holding.combined_avg_price, 2)}</div>
                <div className="py-3 px-6 text-right flex justify-center space-x-1">
                  <span
                    className={
                      holding.current_value - holding.total_contributed > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {round((holding.current_value / holding.total_contributed - 1) * 100, 2) + "%"}
                  </span>
                  <span>/</span>
                  <span
                    className={
                      holding.current_value - holding.total_contributed > 0
                        ? "text-green-500"
                        : "text-red-500"
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
