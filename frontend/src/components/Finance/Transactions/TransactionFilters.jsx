"use client"

import { useState, useEffect } from "react"
import { transactions } from "../../../app/finances/mockData"

const TransactionFilters = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([])
  const [accounts, setAccounts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedAccount, setSelectedAccount] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  
  useEffect(() => {
    // Extract unique categories from transactions
    const uniqueCategories = [...new Set(transactions.map(t => t.category))].sort()
    setCategories(uniqueCategories)
    
    // Extract unique accounts from transactions
    const uniqueAccounts = [...new Set(transactions.map(t => t.account).filter(Boolean))].sort()
    setAccounts(uniqueAccounts)
  }, [])
  
  const handleCategoryChange = (e) => {
    const category = e.target.value
    setSelectedCategory(category)
    onFilterChange({ 
      category, 
      account: selectedAccount, 
      searchTerm, 
      dateRange 
    })
  }
  
  const handleAccountChange = (e) => {
    const account = e.target.value
    setSelectedAccount(account)
    onFilterChange({ 
      category: selectedCategory, 
      account, 
      searchTerm, 
      dateRange 
    })
  }
  
  const handleSearchChange = (e) => {
    const term = e.target.value
    setSearchTerm(term)
    onFilterChange({ 
      category: selectedCategory, 
      account: selectedAccount, 
      searchTerm: term, 
      dateRange 
    })
  }
  
  const handleDateChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value }
    setDateRange(newDateRange)
    onFilterChange({ 
      category: selectedCategory, 
      account: selectedAccount, 
      searchTerm, 
      dateRange: newDateRange 
    })
  }
  
  const clearFilters = () => {
    setSelectedCategory("")
    setSelectedAccount("")
    setSearchTerm("")
    setDateRange({ from: "", to: "" })
    onFilterChange({ 
      category: "", 
      account: "", 
      searchTerm: "", 
      dateRange: { from: "", to: "" } 
    })
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Filter Transactions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="col-span-1 md:col-span-3">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {/* Account Filter */}
        <div>
          <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">
            Account
          </label>
          <select
            id="account"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedAccount}
            onChange={handleAccountChange}
          >
            <option value="">All Accounts</option>
            {accounts.map(account => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>
        </div>
        
        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            id="date-from"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={dateRange.from}
            onChange={(e) => handleDateChange("from", e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            id="date-to"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={dateRange.to}
            onChange={(e) => handleDateChange("to", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default TransactionFilters
