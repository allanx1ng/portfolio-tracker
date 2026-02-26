"use client"

import { useState, useEffect } from "react"
import { balanceHistory } from "../../../app/finances/mockData"
import { formatNumber, formatCurrency } from "@/util/util"

const SimpleBalanceChart = () => {
  const [timeframe, setTimeframe] = useState("month")
  const [chartData, setChartData] = useState([])
  const [maxValue, setMaxValue] = useState(0)
  
  useEffect(() => {
    // Get data for the selected timeframe
    const data = balanceHistory[timeframe]
    setChartData(data)
    
    // Calculate max value for scaling
    const max = Math.max(...data.map(item => item.balance))
    setMaxValue(max)
  }, [timeframe])
  
  const timeframeOptions = [
    { value: "week", label: "1 Week" },
    { value: "month", label: "1 Month" },
    { value: "threeMonths", label: "3 Months" },
    { value: "year", label: "1 Year" }
  ]
  
  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    if (timeframe === "year") {
      return date.toLocaleDateString(undefined, { month: "short", year: "2-digit" })
    } else {
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    }
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Balance History</h3>
        <div className="flex space-x-2">
          {timeframeOptions.map(option => (
            <button
              key={option.value}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                timeframe === option.value
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setTimeframe(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-80">
        {/* Current Balance */}
        <div className="mb-4">
          <div className="text-sm text-gray-500">Current Balance</div>
          <div className="text-2xl font-bold text-gray-800">
            {chartData.length > 0 ? formatCurrency(chartData[chartData.length - 1].balance) : "$0.00"}
          </div>
        </div>
        
        {/* Simple Chart */}
        <div className="relative h-60 border-b border-l border-gray-300">
          {/* Y-axis labels */}
          <div className="absolute -left-14 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <div>${formatNumber(maxValue, 0)}</div>
            <div>${formatNumber(maxValue * 0.75, 0)}</div>
            <div>${formatNumber(maxValue * 0.5, 0)}</div>
            <div>${formatNumber(maxValue * 0.25, 0)}</div>
            <div>$0</div>
          </div>
          
          {/* Chart bars */}
          <div className="flex justify-between h-full items-end pt-4 pb-1">
            {chartData.map((item, index) => {
              // Only show a subset of bars for larger datasets
              if (timeframe === "year" && index % 12 !== 0) return null
              if (timeframe === "threeMonths" && index % 6 !== 0) return null
              if (timeframe === "month" && index % 3 !== 0) return null
              
              const height = (item.balance / maxValue) * 100
              return (
                <div key={index} className="flex flex-col items-center group">
                  <div 
                    className="w-6 bg-indigo-500 rounded-t-sm mx-1 group-hover:bg-indigo-600 transition-colors"
                    style={{ height: `${height}%` }}
                  ></div>
                  {/* X-axis label */}
                  {(index === 0 || index === chartData.length - 1 || index % (chartData.length > 20 ? 10 : 5) === 0) && (
                    <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left">
                      {formatDate(item.date)}
                    </div>
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 bg-white px-2 py-1 rounded shadow-md border border-gray-200 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="font-semibold">{formatDate(item.date)}</div>
                    <div>{formatCurrency(item.balance)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleBalanceChart
