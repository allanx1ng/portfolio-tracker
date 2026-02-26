"use client"

import { useMemo, useState, useEffect } from "react"
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts"
import { formatCurrency, formatNumber } from "@/util/format"

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

const MAX_SLICES = 8

/**
 * Generic pie/donut chart component.
 *
 * @param {Array}  data          - Array of { label: string, value: number }
 * @param {string} totalLabel    - Label shown above the total (e.g. "Total Holdings Value")
 * @param {string} emptyMessage  - Message when data is empty
 * @param {string} valueLabel    - Label used in tooltip for the value (e.g. "Value", "Spent")
 * @param {string} weightLabel   - Label used in tooltip for the percentage (e.g. "Weight", "Share")
 * @param {number} maxSlices     - Max individual slices before grouping into "Other"
 * @param {boolean} showLegend   - Whether to show the legend below the chart
 * @param {boolean} outerLabels  - Show label lines pointing outward with name + percentage
 */
const PieChart = ({
  data = [],
  totalLabel = "Total",
  emptyMessage = "No data",
  valueLabel = "Value",
  weightLabel = "Weight",
  maxSlices = MAX_SLICES,
  showLegend = true,
  outerLabels = false
}) => {
  const { chartData, total } = useMemo(() => {
    if (!data || data.length === 0) return { chartData: [], total: 0 }

    const total = data.reduce((sum, item) => sum + item.value, 0)

    const sorted = [...data].sort((a, b) => b.value - a.value)

    // Split into significant (>=5%) and small (<5%) slices
    const significant = []
    let otherValue = 0
    sorted.forEach(item => {
      if ((item.value / total) >= 0.05 && significant.length < maxSlices) {
        significant.push(item)
      } else {
        otherValue += item.value
      }
    })

    const slices = significant.map(item => ({
      name: item.label,
      value: formatNumber(item.value, 2),
      rawValue: item.value,
      percentage: formatNumber((item.value / total) * 100, 1)
    }))

    if (otherValue > 0) {
      slices.push({
        name: "Other",
        value: formatNumber(otherValue, 2),
        rawValue: otherValue,
        percentage: formatNumber((otherValue / total) * 100, 1)
      })
    }

    return { chartData: slices, total }
  }, [data, maxSlices])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload
      return (
        <div className="bg-white p-3 rounded shadow-md border border-gray-200">
          <p className="font-semibold text-gray-700">{d.name}</p>
          <p className="text-sm text-gray-600">
            {valueLabel}: <span className="font-medium">{formatCurrency(d.rawValue)}</span>
          </p>
          <p className="text-sm text-gray-600">
            {weightLabel}: <span className="font-medium">{d.percentage}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-700 truncate">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  const InnerLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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

  const OuterLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
    if (percent < 0.02) return null

    const RADIAN = Math.PI / 180
    const radius = outerRadius + 25
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    const isRight = x > cx

    const truncated = name.length > 20 ? name.slice(0, 17) + "..." : name
    const label = `${truncated} (${(percent * 100).toFixed(0)}%)`
    const charWidth = 6.2
    const boxWidth = label.length * charWidth + 12
    const boxHeight = 22
    const boxX = isRight ? x + 4 : x - boxWidth - 4
    const boxY = y - boxHeight / 2

    return (
      <g>
        <rect
          x={boxX}
          y={boxY}
          width={boxWidth}
          height={boxHeight}
          rx={4}
          ry={4}
          fill="#f9fafb"
          stroke="#e5e7eb"
          strokeWidth={1}
        />
        <text
          x={isRight ? x + 10 : x - 10}
          y={y}
          fill="#374151"
          textAnchor={isRight ? "start" : "end"}
          dominantBaseline="central"
          fontSize={11}
        >
          {label}
        </text>
      </g>
    )
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (chartData.length === 0) {
    return <p className="text-center text-text-secondary">{emptyMessage}</p>
  }

  return (
    <>
      <div className="mb-4 text-center">
        <div className="text-sm text-text-secondary">{totalLabel}</div>
        <div className="text-2xl font-bold text-text-primary">{formatCurrency(total)}</div>
      </div>

      <div style={{ width: '100%', minWidth: 0, height: outerLabels ? 400 : 288 }}>
        {mounted && <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={outerLabels}
              label={outerLabels ? OuterLabel : InnerLabel}
              outerRadius={outerLabels ? 120 : 100}
              innerRadius={outerLabels ? 60 : 50}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              animationDuration={500}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend
                content={<CustomLegend />}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>}
      </div>
    </>
  )
}

export default PieChart
