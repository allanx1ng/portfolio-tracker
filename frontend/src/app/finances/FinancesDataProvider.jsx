"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { getFinancialData } from "@/util/transactionService";
import { errorMsg, warnMsg } from "@/util/toastNotifications";
import { balanceHistory, spendingByCategory, monthlyStats, percentageChanges, transactions as mockTransactions, bankAccounts, cards } from "./mockData"

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
    error: null,
    useMockData: false // Flag to indicate whether we're using mock data
  })
  
  // Load finances data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, isLoading: true }))
        
        try {
          // Try to get real transaction data from the API
          const realData = await getFinancialData();
          
          // If successful, use the real transactions data with mock data for other fields
          setData({
            balanceHistory,
            spendingByCategory,
            monthlyStats,
            percentageChanges,
            transactions: realData.transactions,
            bankAccounts,
            cards,
            isLoading: false,
            error: null,
            useMockData: false
          });
          
          console.log('Using real transaction data');
        } catch (apiError) {
          console.warn('Failed to fetch real data, falling back to mock data:', apiError);
          
          // Only show a warning if it's a network or auth error
          if (apiError.response?.status >= 500 || apiError.response?.status === 401) {
            warnMsg('Using sample data - could not connect to transaction service');
          }
          
          // Fall back to mock data
          await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
          
          setData({
            balanceHistory,
            spendingByCategory,
            monthlyStats,
            percentageChanges,
            transactions: mockTransactions,
            bankAccounts,
            cards,
            isLoading: false,
            error: null,
            useMockData: true
          });
          
          console.log('Using mock transaction data');
        }
      } catch (err) {
        console.error('Error loading financial data:', err);
        
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: err.message,
          useMockData: true
        }));
        
        errorMsg('Error loading financial data');
      }
    }
    
    fetchData();
  }, [])
  
  return (
    <FinancesDataContext.Provider value={data}>
      {children}
    </FinancesDataContext.Provider>
  )
}
