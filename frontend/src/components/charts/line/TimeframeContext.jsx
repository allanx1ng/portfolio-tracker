"use client"

import { createContext, useContext, useState } from "react"

// Create context
const TimeframeContext = createContext()

// Custom hook to use the timeframe context
export const useTimeframe = () => {
  const context = useContext(TimeframeContext)
  if (!context) {
    throw new Error("useTimeframe must be used within a TimeframeProvider")
  }
  return context
}

// Provider component
export const TimeframeProvider = ({ children }) => {
  const [timeframe, setTimeframe] = useState("month")
  
  const timeframeOptions = [
    { value: "week", label: "1 Week" },
    { value: "month", label: "1 Month" },
    { value: "threeMonths", label: "3 Months" },
    { value: "year", label: "1 Year" }
  ]
  
  return (
    <TimeframeContext.Provider value={{ timeframe, setTimeframe, timeframeOptions }}>
      {children}
    </TimeframeContext.Provider>
  )
}

// Timeframe selector component
export const TimeframeSelector = () => {
  const { timeframe, setTimeframe, timeframeOptions } = useTimeframe()
  
  return (
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
  )
}
