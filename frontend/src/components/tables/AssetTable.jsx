"use client"
import { useState, Fragment } from "react"
import { percentGainCalc, percentPortfolioCalc, round } from "@/util/util"
import SortData from "@/components/tables/SortData"

export default function ({ data, tvl }) {
  const [displayData, setDisplayData] = useState([])
  return (
    <>
      <div className="flex justify-between">
        <h2>Holdings:</h2>
        <SortData data={data} displayData={displayData} setDisplayData={setDisplayData} />
      </div>

      <div className="overflow-x-auto transition-opacity duration-300 ease-in-out text-primary grid grid-cols-1 gap-2 my-8 px-8 py-8 rounded-3xl bg-secondary">
        <>
          <div className="grid grid-cols-7 uppercase leading-normal px-10 py-2 text-black rounded-full font-bold">
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

                <a
                  href={
                    "/asset/" +
                    (holding.asset_type == "coin" ? "coin/" : "stock/") +
                    holding.asset_id
                  }
                >
                  <img
                    src={
                      "https://s2.coinmarketcap.com/static/img/coins/128x128/" +
                      holding.asset_id +
                      ".png"
                    }
                    alt={`Icon`}
                    className="w-12 h-12 mr-4 bg-white rounded-full"
                  />
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
