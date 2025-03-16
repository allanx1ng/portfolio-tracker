"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import TransactionFilters from "../../../components/Finance/Transactions/TransactionFilters"
import TransactionTable from "../../../components/Finance/Transactions/TransactionTable"
import { FinancesDataProvider, useFinancesData } from "../FinancesDataProvider"

// Component that uses the finances data context
function TransactionsContent() {
  const { transactions, isLoading } = useFinancesData()
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [filters, setFilters] = useState({
    category: "",
    account: "",
    searchTerm: "",
    dateRange: { from: "", to: "" }
  })
  
  // Initialize filtered transactions when transactions change
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      setFilteredTransactions(transactions)
    }
  }, [transactions])
  
  useEffect(() => {
    if (!transactions || transactions.length === 0) return
    
    // Apply filters to transactions
    let filtered = [...transactions]
    
    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category)
    }
    
    // Filter by account
    if (filters.account) {
      filtered = filtered.filter(t => t.account === filters.account)
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(term) || 
        t.category.toLowerCase().includes(term) ||
        t.paymentMethod.toLowerCase().includes(term) ||
        (t.account && t.account.toLowerCase().includes(term))
      )
    }
    
    // Filter by date range
    if (filters.dateRange.from) {
      const fromDate = new Date(filters.dateRange.from)
      filtered = filtered.filter(t => new Date(t.date) >= fromDate)
    }
    
    if (filters.dateRange.to) {
      const toDate = new Date(filters.dateRange.to)
      // Set time to end of day
      toDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter(t => new Date(t.date) <= toDate)
    }
    
    setFilteredTransactions(filtered)
  }, [filters, transactions])
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
            <div className="h-12 bg-gray-200 w-full"></div>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 w-full border-t border-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <Link 
            href="/finances" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        {/* Filters */}
        <TransactionFilters onFilterChange={handleFilterChange} />
        
        {/* Transaction Table */}
        <TransactionTable transactions={filteredTransactions} />
      </div>
    </div>
  )
}

// Wrapper component that provides the data context
export default function TransactionsPage() {
  return (
    <FinancesDataProvider>
      <TransactionsContent />
    </FinancesDataProvider>
  )
}
