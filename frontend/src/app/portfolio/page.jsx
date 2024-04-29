import Settings from "./Settings"
import BarChart from "./barchart"
import {Fragment} from "react"

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
  return (
    <div>
      <div className="m-24 w-1/2 min-h-1/2 ">
        <BarChart />
      </div>
      <div>
        <h1>Total holdings</h1>

        <div className="overflow-x-auto">
          <div className="min-w-screen bg-white shadow-md rounded my-6">
            {/* Use grid layout for equal width columns */}
            <div className="grid grid-cols-6 text-gray-600 uppercase text-sm leading-normal">
              <div className="py-3 px-6 text-left">Asset</div>
              <div className="py-3 px-6 text-left">% of portfolio</div>
              <div className="py-3 px-6 text-center">Total Value</div>
              <div className="py-3 px-6 text-center">Amount</div>
              <div className="py-3 px-6 text-center">Current Price</div>
              <div className="py-3 px-6 text-right">All time gainz</div>
            </div>
            <div className="grid grid-cols-6 text-gray-600 text-sm font-light">
              {holdings.map((holding, index) => (
                <Fragment key={index}>
                  <div className="py-3 px-6 text-left whitespace-nowrap">{holding.asset}</div>
                  <div className="py-3 px-6 text-left">{holding.portfolioPercentage}</div>
                  <div className="py-3 px-6 text-center">{holding.totalValue}</div>
                  <div className="py-3 px-6 text-center">{holding.amount}</div>
                  <div className="py-3 px-6 text-center">{holding.currentPrice}</div>
                  <div className="py-3 px-6 text-right">
                    <span>{holding.allTimeGains}</span>{" "}
                    <span className="text-green-500">{holding.gainsAmount}</span>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Settings />
    </div>
  )
}

export default Portfolio
