"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { formatCurrency } from "@/util/util"
import { useFinancesData } from "../../../app/finances/FinancesDataProvider"

const TopAccounts = () => {
  const { isLoading } = useFinancesData()
  const [topAccounts, setTopAccounts] = useState([])
  
  // Get accounts from the context
  const { bankAccounts } = useFinancesData()
  
  useEffect(() => {
    if (bankAccounts && bankAccounts.length > 0) {
      // Sort accounts by balance (descending) and take top 3
      const sorted = [...bankAccounts].sort((a, b) => b.balance - a.balance).slice(0, 3)
      setTopAccounts(sorted)
    }
  }, [bankAccounts])
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Top Accounts</h3>
        </div>
        
        <div className="animate-pulse">
          {[...Array(3)].map((_, i) => (
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
        <h3 className="text-lg font-semibold text-gray-700">Top Accounts</h3>
        <Link href="/finances/accounts" className="text-indigo-500 text-sm hover:underline">
          View All
        </Link>
      </div>
      
      <div className="overflow-hidden">
        <div className="overflow-y-auto max-h-80 pr-2">
          {topAccounts && topAccounts.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {topAccounts.map((account) => (
                <li key={account.id} className="py-3">
                  <Link href={`/finances/accounts/${account.id}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${account.color}20`, color: account.color }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800">{account.name}</p>
                          <p className="text-xs text-gray-500">{account.institution} • {account.type}</p>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(account.balance)}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4 text-gray-500">No accounts found</div>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <Link 
          href="/finances/accounts" 
          className="w-full block text-center py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          View All Accounts
        </Link>
      </div>
    </div>
  )
}

export default TopAccounts
