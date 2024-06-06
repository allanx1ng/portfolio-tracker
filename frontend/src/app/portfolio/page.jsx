import Settings from "./Settings"
import BarChart from "./barchart"

import FetchPortfolio from "./fetchPortfolio"

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

        <a href="/portfolios">individual portfolios</a>
        <FetchPortfolio/>

        
      </div>

      <Settings />
    </div>
  )
}

export default Portfolio
