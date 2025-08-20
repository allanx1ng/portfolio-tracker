"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import TransactionFilters from "../../../components/Finance/Transactions/TransactionFilters"
import TransactionTable from "../../../components/Finance/Transactions/TransactionTable"
import SyncTransactionsButton from "../../../components/Finance/Transactions/SyncTransactionsButton"
import { FinancesDataProvider, useFinancesData } from "../FinancesDataProvider"
import { getFinancialData, getConnectedAccounts } from "@/util/transactionService"
import { errorMsg } from "@/util/toastNotifications"

// Component that uses the finances data context
function TransactionsContent() {
  const { transactions, isLoading, useMockData } = useFinancesData()
  const [selectedItemId, setSelectedItemId] = useState("")
  const [connectedAccounts, setConnectedAccounts] = useState([])
  
  // Fetch connected accounts
  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      try {
        if (!useMockData) {
          const result = await getConnectedAccounts();
          if (result.connections) {
            setConnectedAccounts(result.connections);
            
            // Auto-select the first account if available
            if (result.connections.length > 0 && !selectedItemId) {
              setSelectedItemId(result.connections[0].item_id);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching connected accounts:', error);
        errorMsg('Failed to fetch connected accounts');
      }
    };
    
    fetchConnectedAccounts();
  }, [useMockData, selectedItemId]);
  const [refreshing, setRefreshing] = useState(false)
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
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          
          <div className="flex space-x-4 mt-2 sm:mt-0">
            {useMockData ? (
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Using Sample Data
              </div>
            ) : null}
            
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
        </div>
        
        {/* Sync Transactions Button */}
        {!useMockData && (
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Refresh Transactions</h2>
            <div className="flex items-center">
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="mr-4 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select an account</option>
                {connectedAccounts.length > 0 ? (
                  connectedAccounts.map(account => (
                    <option key={account.item_id} value={account.item_id}>
                      {account.institution_name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No connected accounts</option>
                )}
              </select>
              
              <SyncTransactionsButton
                itemId={selectedItemId}
                buttonText="Sync Now"
                showCounts={true}
                onSuccess={() => {
                  setRefreshing(true);
                  // Refresh data after sync
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }}
              />
              
              {refreshing && (
                <div className="ml-4 flex items-center text-sm text-gray-500">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing data...
                </div>
              )}
            </div>
          </div>
        )}
        
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
