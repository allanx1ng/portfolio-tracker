"use client"
import PieChart from "@/components/charts/pie/PieChart"
import { useState, useEffect } from "react"
import { usePortfolio } from "@/context/TotalAssetContext"
import { round, percentPortfolioCalc } from "@/util/util"

export default function () {
  const { data, tvl } = usePortfolio()

  const [chartDisplayState, setDisplayState] = useState("dollar")
  const [chartDisplayData, setChartDisplayData] = useState([])

  useEffect(() => {
    processData()
  }, [data])

  const CenteredMetric = ({ centerX, centerY }) => (
    <text
      x={centerX}
      y={centerY}
      textAnchor="middle"
      dominantBaseline="central"
      className="font-semibold text-xl flex gap-10"
    >
      <tspan x={centerX} dy="-2rem">
        Net Worth:
      </tspan>
      <tspan x={centerX} dy="2rem" className="text-4xl">
        {`$${round(tvl, 2)}`}
      </tspan>
    </text>
  )

  const processData = () => {
    let totalAmt = 0
    let totalPercentage = 0
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      //   console.log(item)
      if (totalPercentage > 90) {
        chartDisplayData[i] = {
          id: "Other",
          label: "Other",
          value:
            chartDisplayState == "dollar"
              ? round(tvl - totalAmt, 0)
              : round(100 - totalPercentage, 2),
        }
        break
      }
      totalPercentage += round(percentPortfolioCalc(item.current_value, tvl), 2)
      totalAmt += Number(item.current_value)
      chartDisplayData[i] = {
        id: item.asset_name,
        label: item.asset_ticker,
        value:
          chartDisplayState == "dollar"
            ? round(item.current_value, 0)
            : round(percentPortfolioCalc(item.current_value, tvl), 2),
      }
    }
    // console.log(chartDisplayData)
  }
  return (
    <PieChart data={chartDisplayData} CenteredMetric={CenteredMetric} state={chartDisplayState} />
  )
}
