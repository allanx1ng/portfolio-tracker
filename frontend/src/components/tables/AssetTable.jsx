"use client"
import { useState, Fragment } from "react"
import { percentGainCalc, percentPortfolioCalc, round } from "@/util/util"
import SortData from "@/components/tables/SortData"

export default function ({ data, tvl }) {
  const [displayData, setDisplayData] = useState([])
  return (
    <>
      <SortData data={data} displayData={displayData} setDisplayData={setDisplayData} />
      <div className="overflow-x-auto transition-opacity duration-300 ease-in-out text-black grid grid-cols-1 gap-2 p-4">
        {/* <div className="min-w-screen bg-base-200 shadow-md rounded my-6 pt-3">
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
        </div> */}

        <>
          <div className="grid grid-cols-7 uppercase leading-normal px-10 py-2 text-white rounded-full font-bold">
            <div className="text-center col-span-2 justify-self-start">Asset</div>
            <div className="text-right justify-self-end">Asset Price</div>
            <div className="text-right justify-self-end">Avg entry price</div>
            <div className="text-right justify-self-end">Contributions</div>
            <div className="text-center col-span-2 justify-self-end">Current Value / Gains</div>
          </div>

          {displayData.map((holding, index) => (
            <div
              key={index}
              className="grid grid-cols-7 w-full rounded-full bg-white shadow-md justify-between items-center px-10 py-4 font-semibold"
            >
              <div className="flex items-center col-span-2">
                {/* {console.log(holding)} */}
                
                <a href={"/asset/" + (holding.asset_type == "coin" ? "coin/" : "stock/") + holding.asset_id}>
                  <img src={"https://s2.coinmarketcap.com/static/img/coins/128x128/" + holding.asset_id + ".png"} alt={`Icon`} className="w-12 h-12 mr-4 rounded-full" />
                </a>

                <div>
                  <div className="font-bold">{holding.asset_name}</div>
                  <div className="text-sm text-gray-600">
                    {round(holding.total_amount, 2)} {holding.asset_ticker} | (
                    {round(percentPortfolioCalc(holding.current_value, tvl), 2) + "%"} of portfolio)
                  </div>
                </div>
              </div>
              <div className="text-sm justify-self-end">${round(holding.current_price, 2)}</div>
              <div className="text-sm justify-self-end">
                ${round(holding.combined_avg_price, 2)}
              </div>
              <div className="text-sm justify-self-end">${round(holding.total_contributed, 2)}</div>
              <div className="flex justify-end justify-self-end col-span-2">
                <div>
                  <div className="font-bold text-right">${round(holding.current_value, 2)}</div>
                  <div
                    className={
                      holding.current_value - holding.total_contributed > 0
                        ? "text-success text-sm"
                        : "text-error text-sm"
                    }
                  >
                    {"$" + round(holding.current_value - holding.total_contributed, 2)} (
                    {round(percentGainCalc(holding.current_value, holding.total_contributed), 2) +
                      "%"}
                    )
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      </div>
    </>
  )
}
