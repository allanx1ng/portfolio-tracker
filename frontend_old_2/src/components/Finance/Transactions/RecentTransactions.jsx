"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { formatCurrency } from "@/util/util"
import { useFinancesData } from "../../../app/finances/FinancesDataProvider"

const RecentTransactions = () => {
  const { isLoading } = useFinancesData()
  const [recentTransactions, setRecentTransactions] = useState([])
  
  // Get transactions from the context
  const { transactions } = useFinancesData()
  
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      // Get the 10 most recent transactions
      setRecentTransactions(transactions.slice(0, 10))
    }
  }, [transactions])
  
  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric"
    })
  }
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Recent Transactions</h3>
        </div>
        
        <div className="animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="py-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="ml-3">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Recent Transactions</h3>
        <Link href="/finances/transactions" className="text-indigo-500 text-sm hover:underline">
          View All
        </Link>
      </div>
      
      <div className="overflow-hidden">
        <div className="overflow-y-auto max-h-80 pr-2">
          {recentTransactions && recentTransactions.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <li key={transaction.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.amount > 0 
                          ? "bg-green-100 text-green-600" 
                          : "bg-red-100 text-red-600"
                      }`}>
                        {transaction.amount > 0 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.date)} • {transaction.category}</p>
                        {transaction.account && (
                          <p className="text-xs text-gray-400">{transaction.account}</p>
                        )}
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      transaction.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {transaction.amount > 0 ? "+" : ""}{formatCurrency(Math.abs(transaction.amount))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4 text-gray-500">No recent transactions</div>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <Link 
          href="/finances/transactions" 
          className="w-full block text-center py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          View All Transactions
        </Link>
      </div>
    </div>
  )
}

export default RecentTransactions
