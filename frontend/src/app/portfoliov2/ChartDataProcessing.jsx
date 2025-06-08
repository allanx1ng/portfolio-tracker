"use client"

import { useState, useEffect } from "react"
import { usePortfolio } from "@/context/TotalAssetContext"
import { round, percentPortfolioCalc } from "@/util/util"
import RechartsPieChart from "@/components/charts/pie/RechartsPieChart"

export default function ChartDataProcessing() {
  const { data, tvl } = usePortfolio()
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    processData()
  }, [data])

  const processData = () => {
    let totalAmt = 0
    let totalPercentage = 0
    const processedData = data.reduce((acc, item, index) => {
      if (totalPercentage > 90) {
        if (!acc.find(d => d.name === "Other")) {
          acc.push({
            name: "Other",
            value: round(tvl - totalAmt, 0)
          })
        }
        return acc
      }

      totalPercentage += round(percentPortfolioCalc(item.current_value, tvl), 2)
      totalAmt += Number(item.current_value)

      acc.push({
        name: item.asset_ticker,
        value: round(item.current_value, 0),
        displayValue: `$${round(item.current_value, 0).toLocaleString()}`
      })
      return acc
    }, [])

    setChartData(processedData)
  }

  return (
    <div className="w-full">
      <div className="flex flex-col items-center mb-6">
        <h3 className="text-lg font-medium text-gray-500">Total Net Worth</h3>
        <p className="text-3xl font-bold text-gray-900">
          ${tvl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
      <div className="h-[400px]">
        <RechartsPieChart
          data={chartData}
          colors={[
            "#3B82F6",
            "#10B981",
            "#F59E0B",
            "#EF4444",
            "#8B5CF6",
            "#EC4899",
            "#6366F1",
            "#64748B"
          ]}
        />
      </div>
    </div>
  )
}
