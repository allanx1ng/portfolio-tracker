"use client"

import { useState, useEffect } from "react"
import { ResponsiveLine } from "@nivo/line"
import { balanceHistory } from "../../../app/finances/mockData"
import { round } from "@/util/util"

const BalanceChart = () => {
  const [timeframe, setTimeframe] = useState("month")
  const [chartData, setChartData] = useState([])
  
  useEffect(() => {
    // Format data for the chart
    const data = balanceHistory[timeframe].map(item => ({
      x: item.date,
      y: item.balance
    }))
    
    setChartData([
      {
        id: "Balance",
        color: "hsl(240, 70%, 50%)",
        data: data
      }
    ])
  }, [timeframe])
  
  const timeframeOptions = [
    { value: "week", label: "1 Week" },
    { value: "month", label: "1 Month" },
    { value: "threeMonths", label: "3 Months" },
    { value: "year", label: "1 Year" }
  ]
  
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
        {chartData.length > 0 && (
          <ResponsiveLine
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false
            }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: "Date",
              legendOffset: 40,
              legendPosition: "middle",
              format: value => {
                // Format date based on timeframe
                const date = new Date(value)
                if (timeframe === "year") {
                  return date.toLocaleDateString(undefined, { month: "short", year: "2-digit" })
                } else {
                  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
                }
              }
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Balance ($)",
              legendOffset: -50,
              legendPosition: "middle",
              format: value => `$${round(value, 0)}`
            }}
            enableGridX={false}
            colors={{ scheme: "category10" }}
            lineWidth={3}
            pointSize={8}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            enableSlices="x"
            animate={false}
            sliceTooltip={({ slice }) => {
              return (
                <div className="bg-white px-2 py-1 shadow-md rounded-md border border-gray-200">
                  <div className="text-gray-600 text-xs">
                    {new Date(slice.points[0].data.x).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </div>
                  {slice.points.map(point => (
                    <div key={point.id} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: point.serieColor }}
                      />
                      <div className="text-gray-700 font-semibold">
                        ${round(point.data.y, 2)}
                      </div>
                    </div>
                  ))}
                </div>
              )
            }}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fontSize: 12,
                    fill: "#6B7280"
                  }
                },
                legend: {
                  text: {
                    fontSize: 14,
                    fill: "#4B5563"
                  }
                }
              },
              grid: {
                line: {
                  stroke: "#E5E7EB",
                  strokeWidth: 1
                }
              },
              crosshair: {
                line: {
                  stroke: "#6366F1",
                  strokeWidth: 1,
                  strokeOpacity: 0.5
                }
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

export default BalanceChart
