"use client"

import { useState, useEffect } from "react"
import { spendingByCategory } from "../../../app/finances/mockData"
import { formatNumber, formatCurrency } from "@/util/util"

const SimpleSpendingPieChart = () => {
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
      value: formatNumber(category.value, 2),
      percentage: formatNumber((category.value / total) * 100, 1)
    }))
    
    setChartData(formattedData)
  }, [])
  
  // Generate a color based on the index
  const getColor = (index) => {
    const colors = [
      'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
      'bg-purple-500', 'bg-teal-500', 'bg-orange-500', 'bg-pink-500'
    ]
    return colors[index % colors.length]
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Spending by Category</h3>
      
      {/* Total Spending */}
      <div className="mb-6 text-center">
        <div className="text-sm text-gray-500">Total Spending</div>
        <div className="text-2xl font-bold text-gray-800">{formatCurrency(totalSpending)}</div>
      </div>
      
      {/* Category List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {chartData.map((category, index) => (
          <div key={category.id} className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${getColor(index)} mr-2`}></div>
            <div className="flex-1 text-sm">{category.label}</div>
            <div className="text-sm font-medium">{formatCurrency(category.value)}</div>
            <div className="text-xs text-gray-500 w-12 text-right">{category.percentage}%</div>
          </div>
        ))}
      </div>
      
      {/* Simple Pie Chart Visualization */}
      <div className="mt-6 flex justify-center">
        <div className="relative w-40 h-40">
          {chartData.map((category, index) => {
            // Calculate the segment's position in the pie
            const previousSegments = chartData.slice(0, index)
            const previousTotal = previousSegments.reduce((sum, cat) => sum + cat.percentage, 0)
            const startAngle = (previousTotal / 100) * 360
            const endAngle = startAngle + (category.percentage / 100) * 360
            
            return (
              <div 
                key={category.id}
                className="absolute inset-0 w-full h-full"
                style={{
                  background: `conic-gradient(transparent ${startAngle}deg, ${getComputedColor(index)} ${startAngle}deg, ${getComputedColor(index)} ${endAngle}deg, transparent ${endAngle}deg)`,
                  borderRadius: '50%'
                }}
              ></div>
            )
          })}
          <div className="absolute inset-0 w-full h-full bg-white rounded-full" style={{ width: '60%', height: '60%', top: '20%', left: '20%' }}></div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get computed color values
const getComputedColor = (index) => {
  const colors = [
    '#6366f1', '#10b981', '#f59e0b', '#f43f5e',
    '#3b82f6', '#22c55e', '#eab308', '#ef4444',
    '#a855f7', '#14b8a6', '#f97316', '#ec4899'
  ]
  return colors[index % colors.length]
}

export default SimpleSpendingPieChart
