"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { balanceHistory, spendingByCategory, monthlyStats, percentageChanges, transactions, bankAccounts, cards } from "./mockData"

// Create context
const FinancesDataContext = createContext(null)

// Custom hook to use the context
export const useFinancesData = () => {
  const context = useContext(FinancesDataContext)
  if (!context) {
    throw new Error("useFinancesData must be used within a FinancesDataProvider")
  }
  return context
}

export const FinancesDataProvider = ({ children }) => {
  const [data, setData] = useState({
    balanceHistory: {},
    spendingByCategory: [],
    monthlyStats: {},
    percentageChanges: {},
    transactions: [],
    bankAccounts: [],
    cards: [],
    isLoading: true,
    error: null
  })
  
  // Load finances data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we're using the mock data directly
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300))
        
        setData({
          balanceHistory,
          spendingByCategory,
          monthlyStats,
          percentageChanges,
          transactions,
          bankAccounts,
          cards,
          isLoading: false,
          error: null
        })
      } catch (err) {
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: err.message
        }))
      }
    }
    
    fetchData()
  }, [])
  
  return (
    <FinancesDataContext.Provider value={data}>
      {children}
    </FinancesDataContext.Provider>
  )
}
