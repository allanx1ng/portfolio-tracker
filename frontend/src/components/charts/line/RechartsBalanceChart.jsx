"use client"

import { useEffect, useRef, useState } from "react"
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine
} from "recharts"
import { formatCurrency, formatNumber } from "@/util/util"
import { useTimeframe } from "./TimeframeContext"

const RechartsBalanceChart = ({ balanceHistory }) => {
  const { timeframe } = useTimeframe()
  const [chartData, setChartData] = useState([])
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(0)
  const [yAxisTicks, setYAxisTicks] = useState([])
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)
  
  // Calculate the number of date labels to show based on container width
  const calculateDateLabels = (width) => {
    if (width < 500) return 3
    if (width < 768) return 5
    if (width < 1024) return 7
    return 9
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    if (timeframe === "year") {
      return date.toLocaleDateString(undefined, { month: "short", year: "2-digit" })
    } else if (timeframe === "threeMonths") {
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    } else {
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    }
  }
  
  // Calculate appropriate Y-axis ticks with even intervals
  const calculateYAxisTicks = (min, max) => {
    // Determine the appropriate interval based on the range
    let range = max - min
    let interval
    
    if (range > 100000) interval = 20000
    else if (range > 50000) interval = 10000
    else if (range > 20000) interval = 5000
    else if (range > 10000) interval = 2000
    else if (range > 5000) interval = 1000
    else if (range > 1000) interval = 500
    else if (range > 500) interval = 100
    else if (range > 100) interval = 50
    else interval = 10
    
    // Round min down and max up to the nearest interval
    const roundedMin = Math.floor(min / interval) * interval
    const roundedMax = Math.ceil(max / interval) * interval
    
    // Generate ticks
    const ticks = []
    for (let i = roundedMin; i <= roundedMax; i += interval) {
      ticks.push(i)
    }
    
    return ticks
  }
  
  // Process data for the selected timeframe
  const processData = (timeframeData) => {
    // For longer timeframes, we might want to aggregate data
    if (timeframe === "year") {
      // For yearly view, use smaller aggregation periods (3-4 days)
      const aggregatedData = []
      for (let i = 0; i < timeframeData.length; i += 4) {
        const periodData = timeframeData.slice(i, i + 4)
        if (periodData.length > 0) {
          const avgBalance = periodData.reduce((sum, item) => sum + item.balance, 0) / periodData.length
          
          // Get the actual date range for this specific period
          const startDate = new Date(periodData[0].date)
          const endDate = new Date(periodData[periodData.length - 1].date)
          
          // Format dates for display
          const startFormatted = startDate.toLocaleDateString(undefined, { 
            month: "short", 
            day: "numeric" 
          })
          
          const endFormatted = endDate.toLocaleDateString(undefined, { 
            month: "short", 
            day: "numeric" 
          })
          
          aggregatedData.push({
            date: periodData[0].date,
            balance: avgBalance,
            // Store original data points for tooltip
            originalData: periodData,
            // Store formatted date range for tooltip
            dateRange: `${startFormatted} - ${endFormatted}`
          })
        }
      }
      return aggregatedData
    } else if (timeframe === "threeMonths") {
      // For three months view, aggregate by 2 days for more granularity
      const aggregatedData = []
      for (let i = 0; i < timeframeData.length; i += 2) {
        const periodData = timeframeData.slice(i, i + 2)
        if (periodData.length > 0) {
          const avgBalance = periodData.reduce((sum, item) => sum + item.balance, 0) / periodData.length
          
          // Get the actual date range for this specific period
          const startDate = new Date(periodData[0].date)
          const endDate = new Date(periodData[periodData.length - 1].date)
          
          // Format dates for display
          const startFormatted = startDate.toLocaleDateString(undefined, { 
            month: "short", 
            day: "numeric" 
          })
          
          const endFormatted = endDate.toLocaleDateString(undefined, { 
            month: "short", 
            day: "numeric" 
          })
          
          aggregatedData.push({
            date: periodData[0].date,
            balance: avgBalance,
            originalData: periodData,
            dateRange: `${startFormatted} - ${endFormatted}`
          })
        }
      }
      return aggregatedData
    } else {
      // For month and week, use daily data
      return timeframeData.map(item => {
        const date = new Date(item.date)
        const formattedDate = date.toLocaleDateString(undefined, { 
          month: "short", 
          day: "numeric" 
        })
        
        return {
          ...item,
          originalData: [item],
          dateRange: formattedDate
        }
      })
    }
  }
  
  // Update chart data when timeframe or balance history changes
  useEffect(() => {
    if (!balanceHistory || !balanceHistory[timeframe]) {
      setChartData([])
      return
    }
    
    const data = balanceHistory[timeframe]
    const processedData = processData(data)
    setChartData(processedData)
    
    // Calculate min and max values
    const balances = data.map(item => item.balance)
    const min = Math.min(0, ...balances) // Ensure we include 0 or go negative for debt
    const max = Math.max(...balances)
    
    setMinValue(min)
    setMaxValue(max)
    
    // Calculate Y-axis ticks
    setYAxisTicks(calculateYAxisTicks(min, max))
  }, [timeframe, balanceHistory])
  
  // Update container width on resize
  useEffect(() => {
    if (!containerRef.current) return
    
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }
    
    // Initial measurement
    updateWidth()
    
    // Add resize listener
    window.addEventListener('resize', updateWidth)
    
    // Cleanup
    return () => window.removeEventListener('resize', updateWidth)
  }, [])
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const originalData = data.originalData || []
      
      return (
        <div className="bg-white p-3 rounded shadow-md border border-gray-200">
          {/* Use the pre-formatted date range */}
          <p className="font-semibold text-gray-700">
            {data.dateRange}
          </p>
          
          {originalData.length > 1 ? (
            // Show average for aggregated data
            <>
              <p className="text-sm text-gray-600">Average Balance:</p>
              <p className="font-medium text-indigo-600">{formatCurrency(data.balance)}</p>
              <p className="text-xs text-gray-500 mt-1">
                Range: {formatCurrency(Math.min(...originalData.map(d => d.balance)))} - {formatCurrency(Math.max(...originalData.map(d => d.balance)))}
              </p>
            </>
          ) : (
            // Show single day data
            <>
              <p className="text-sm text-gray-600">Balance:</p>
              <p className="font-medium text-indigo-600">{formatCurrency(data.balance)}</p>
            </>
          )}
        </div>
      )
    }
    
    return null
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8" ref={containerRef}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Balance History</h3>
      </div>
      
      <div className="h-80">
        {/* Current Balance */}
        <div className="mb-4">
          <div className="text-sm text-gray-500">Current Balance</div>
          <div className="text-2xl font-bold text-gray-800">
            {chartData.length > 0 ? formatCurrency(chartData[chartData.length - 1].balance) : "$0.00"}
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 10 }}
                tickMargin={10}
                interval={Math.max(0, Math.floor(chartData.length / calculateDateLabels(containerWidth)) - 1)}
                // Add more ticks for better date representation
                ticks={chartData.map(item => item.date)}
                // Allow the chart to generate ticks at regular intervals
                allowDataOverflow={true}
              />
              <YAxis 
                domain={[minValue, yAxisTicks[yAxisTicks.length - 1] || maxValue]}
                ticks={yAxisTicks}
                tickFormatter={(value) => `$${formatNumber(value, 0)}`}
                tick={{ fontSize: 10 }}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 3, fill: "#6366f1" }}
                activeDot={{ r: 5, fill: "#4f46e5" }}
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default RechartsBalanceChart
