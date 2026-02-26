"use client"

import React, { createContext, useContext, useState } from "react"

const TimeframeContext = createContext()

export function TimeframeProvider({ children }) {
  const [timeframe, setTimeframe] = useState("1M") // Default to 1 month view

  const value = {
    timeframe,
    setTimeframe
  }

  return (
    <TimeframeContext.Provider value={value}>
      {children}
    </TimeframeContext.Provider>
  )
}

export function useTimeframe() {
  const context = useContext(TimeframeContext)
  if (!context) {
    throw new Error("useTimeframe must be used within a TimeframeProvider")
  }
  return context
}

export function TimeframeSelector() {
  const { timeframe, setTimeframe } = useTimeframe()

  const timeframes = [
    { label: "1M", value: "1M" },
    { label: "3M", value: "3M" },
    { label: "6M", value: "6M" },
    { label: "1Y", value: "1Y" },
    { label: "ALL", value: "ALL" }
  ]

  return (
    <div className="inline-flex rounded-md shadow-sm">
      {timeframes.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setTimeframe(value)}
          className={`
            px-4 py-2 text-sm font-medium
            ${timeframe === value
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
            }
            ${value === "1M" ? "rounded-l-md" : ""}
            ${value === "ALL" ? "rounded-r-md" : ""}
            border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          `}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
