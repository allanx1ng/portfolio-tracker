"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import AccountHeader from "./AccountHeader"
import { TimeframeProvider } from "../../../../components/charts/line/TimeframeContext"
import RechartsBalanceChart from "../../../../components/charts/line/RechartsBalanceChart"
import TransactionTable from "../../../../components/Finance/Transactions/TransactionTable"
import TransactionFilters from "../../../../components/Finance/Transactions/TransactionFilters"
import { AccountDataProvider, useAccountData } from "./AccountDataProvider"

// Component that uses the account data context
function AccountDetail() {
  const { account, linkedCards, balanceHistory, transactions, isLoading, error } = useAccountData()
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [filters, setFilters] = useState({
    category: "",
    account: "",
    searchTerm: "",
    dateRange: { from: "", to: "" }
  })
  
  // Apply filters to transactions
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    
    let filtered = [...transactions]
    
    // Filter by category
    if (newFilters.category) {
      filtered = filtered.filter(t => t.category === newFilters.category)
    }
    
    // Filter by account
    if (newFilters.account) {
      filtered = filtered.filter(t => t.account === newFilters.account)
    }
    
    // Filter by search term
    if (newFilters.searchTerm) {
      const term = newFilters.searchTerm.toLowerCase()
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(term) || 
        t.category.toLowerCase().includes(term) ||
        t.paymentMethod.toLowerCase().includes(term) ||
        (t.account && t.account.toLowerCase().includes(term))
      )
    }
    
    // Filter by date range
    if (newFilters.dateRange.from) {
      const fromDate = new Date(newFilters.dateRange.from)
      filtered = filtered.filter(t => new Date(t.date) >= fromDate)
    }
    
    if (newFilters.dateRange.to) {
      const toDate = new Date(newFilters.dateRange.to)
      // Set time to end of day
      toDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter(t => new Date(t.date) <= toDate)
    }
    
    setFilteredTransactions(filtered)
  }
  
  // Initialize filtered transactions when transactions change
  useEffect(() => {
    setFilteredTransactions(transactions)
  }, [transactions])
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading account data...</h1>
          <p className="text-gray-600">Please wait while we fetch your account information.</p>
        </div>
      </div>
    )
  }
  
  if (error || !account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Account not found</h1>
          <p className="text-gray-600">The account you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="w-full h-16" 
        style={{ backgroundColor: account.color, opacity: 0.1 }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        <AccountHeader account={account} linkedCards={linkedCards} />
        
        <TimeframeProvider>
          <div className="mb-8">
            <RechartsBalanceChart balanceHistory={balanceHistory} />
          </div>
        </TimeframeProvider>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
          
          {/* Filters */}
          <TransactionFilters onFilterChange={handleFilterChange} />
          
          {/* Transaction Table */}
          <TransactionTable transactions={filteredTransactions.length > 0 ? filteredTransactions : transactions} />
        </div>
      </div>
    </div>
  )
}

// Wrapper component that provides the data context
export default function AccountDetailPage() {
  const params = useParams()
  const accountId = params.accountId
  
  return (
    <AccountDataProvider accountId={accountId}>
      <AccountDetail />
    </AccountDataProvider>
  )
}
