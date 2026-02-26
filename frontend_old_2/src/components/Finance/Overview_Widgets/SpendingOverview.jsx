"use client"

import { formatCurrency } from "@/util/util"

const SpendingOverview = ({ spending, percentChange }) => {
  // For spending, a decrease is positive (green) and an increase is negative (red)
  const isPositiveChange = percentChange <= 0
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-amber-500">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Total Spending</h3>
        <div className="p-2 bg-amber-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-gray-800">{formatCurrency(spending)}</span>
        <div className={`flex items-center mt-2 ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
          <span className="text-sm font-medium">
            {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
          </span>
          {isPositiveChange ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          <span className="text-xs text-gray-500 ml-1">vs last month</span>
        </div>
      </div>
    </div>
  )
}

export default SpendingOverview
