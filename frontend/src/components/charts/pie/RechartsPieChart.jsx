"use client"

import { useState, useEffect } from "react"
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from "recharts"
import { formatCurrency, formatNumber } from "@/util/util"
import { useTimeframe } from "../line/TimeframeContext"

const COLORS = [
  '#6366f1', // indigo
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#3b82f6', // blue
  '#22c55e', // green
  '#eab308', // yellow
  '#ef4444', // red
  '#a855f7', // purple
  '#14b8a6', // teal
  '#f97316', // orange
  '#ec4899'  // pink
]

const RechartsPieChart = ({ data = [] }) => {
  const { timeframe } = useTimeframe()
  const [chartData, setChartData] = useState([])
  const [totalSpending, setTotalSpending] = useState(0)
  
  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([])
      setTotalSpending(0)
      return
    }
    
    // Calculate total spending
    const total = data.reduce((sum, category) => sum + category.value, 0)
    setTotalSpending(total)
    
    // Format data for the pie chart
    const formattedData = data.map(category => ({
      name: category.label,
      value: formatNumber(category.value, 2),
      rawValue: category.value,
      percentage: formatNumber((category.value / total) * 100, 1)
    }))
    
    setChartData(formattedData)
  }, [data, timeframe])
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      
      return (
        <div className="bg-white p-3 rounded shadow-md border border-gray-200">
          <p className="font-semibold text-gray-700">{data.name}</p>
          <p className="text-sm text-gray-600">
            Amount: <span className="font-medium">{formatCurrency(data.rawValue)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentage: <span className="font-medium">{data.percentage}%</span>
          </p>
        </div>
      )
    }
    
    return null
  }
  
  // Custom legend component to ensure all categories are visible without scrolling
  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-xs text-gray-700 truncate">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  
  // Custom label component
  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    // Only show label for segments with percentage > 5%
    if (percent < 0.05) return null
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180)
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180)
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={10}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Spending by Category</h3>
      
      {/* Total Spending */}
      <div className="mb-6 text-center">
        <div className="text-sm text-gray-500">Total Spending</div>
        <div className="text-2xl font-bold text-gray-800">{formatCurrency(totalSpending)}</div>
      </div>
      
      {/* Chart */}
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              animationDuration={500}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              content={<CustomLegend />}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RechartsPieChart
