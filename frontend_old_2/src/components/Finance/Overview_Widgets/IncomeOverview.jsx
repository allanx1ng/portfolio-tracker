"use client"

import { formatCurrency } from "@/util/util"

const IncomeOverview = ({ income, percentChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-emerald-500">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Total Income</h3>
        <div className="p-2 bg-emerald-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-gray-800">{formatCurrency(income)}</span>
        <div className={`flex items-center mt-2 ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          <span className="text-sm font-medium">
            {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
          </span>
          {percentChange >= 0 ? (
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

export default IncomeOverview
