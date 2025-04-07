"use client"

import { useState, useEffect } from "react"
import FinancePieChart from "./FinancePieChart"
import { spendingByCategory } from "../../../app/finances/mockData"
import { round } from "@/util/util"

const SpendingPieChart = () => {
  const [chartData, setChartData] = useState([])
  const [totalSpending, setTotalSpending] = useState(0)
  
  useEffect(() => {
    // Calculate total spending
    const total = spendingByCategory.reduce((sum, category) => sum + category.value, 0)
    setTotalSpending(total)
    
    // Format data for the pie chart
    const formattedData = spendingByCategory.map(category => ({
      id: category.id,
      label: category.label,
      value: round(category.value, 2)
    }))
    
    setChartData(formattedData)
  }, [])
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Spending by Category</h3>
      <div className="h-80">
        {chartData.length > 0 && (
          <FinancePieChart 
            data={chartData} 
            totalSpending={totalSpending}
          />
        )}
      </div>
    </div>
  )
}

export default SpendingPieChart
