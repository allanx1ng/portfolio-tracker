import PieChart from "@/components/charts/pie/PieChart"

import { useState, useEffect } from "react"
import { usePortfolio } from "@/context/TotalAssetContext"
import { round, percentPortfolioCalc } from "@/util/util"

export default function () {
  const { data, tvl } = usePortfolio()
  const [displayData, setDisplayData] = useState([])
  useEffect(() => {
    processData()
  }, [data])

  const processData = () => {
    let totalStocks = 0
    let totalCrypto = 0
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      //   console.log(item)
      if (item.asset_type == "stock") {
        totalStocks += Number(item.current_value)
      } else {
        totalCrypto += Number(item.current_value)
      }
    }
    // console.log(round(percentPortfolioCalc(totalStocks, tvl), 2))

    const tempArr = []

    if (totalStocks > 0)
      tempArr.push({
        id: "Stocks",
        label: "Stocks",
        value: round(percentPortfolioCalc(totalStocks, tvl), 2),
      })

    if (totalCrypto > 0)
      tempArr.push({
        id: "Crypto",
        label: "Crypto",
        value: round(percentPortfolioCalc(totalCrypto, tvl), 2),
      })

      setDisplayData(tempArr)

    // console.log(displayData)
  }

  return displayData.length == 0 ? (
    <div>No assets found</div>
  ) : (
    <PieChart data={displayData} state={"percent"} />
  )
}
