"use client"

import { useTimeframe } from "./TimeframeContext"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts"

const RechartsBalanceChart = ({ balanceHistory }) => {
  const { timeframe } = useTimeframe()
  
  // Handle both array format and timeframe object format
  const getChartData = () => {
    if (Array.isArray(balanceHistory)) {
      return balanceHistory
    }
    
    // Map timeframe to data key
    const timeframeMap = {
      "1M": "month",
      "3M": "threeMonths",
      "6M": "threeMonths", // Fallback to 3 months if no 6-month data
      "1Y": "year",
      "ALL": "year"
    }
    
    const key = timeframeMap[timeframe] || "month"
    return balanceHistory[key]
  }
  
  const chartData = getChartData()

  // Format the tooltip value as currency
  const formatTooltipValue = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(date)
  }

  // Get value from data point, handling both formats
  const getValue = (dataPoint) => dataPoint.value || dataPoint.balance || 0

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fill: '#6B7280' }}
          tickLine={{ stroke: '#6B7280' }}
        />
        <YAxis
          tickFormatter={formatTooltipValue}
          tick={{ fill: '#6B7280' }}
          tickLine={{ stroke: '#6B7280' }}
        />
        <Tooltip
          formatter={formatTooltipValue}
          labelFormatter={formatDate}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: '0.5rem',
            padding: '0.5rem'
          }}
        />
        <Line
          type="monotone"
          dataKey={chartData && chartData[0]?.balance !== undefined ? "balance" : "value"}
          stroke="#4F46E5"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: '#4F46E5' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default RechartsBalanceChart
