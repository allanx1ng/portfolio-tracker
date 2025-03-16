"use client"

import { formatCurrency } from "@/util/util"

const BalanceOverview = ({ balance, percentChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-indigo-500">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Total Balance</h3>
        <div className="p-2 bg-indigo-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-gray-800">{formatCurrency(balance)}</span>
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

export default BalanceOverview
