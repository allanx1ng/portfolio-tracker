"use client"

import React, { createContext, useContext } from 'react'

const DashboardContext = createContext()

// Mock data for initial UI development
// Generate some mock data following the same format as finances
const generateDates = (days) => {
  const dates = []
  const today = new Date()
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  return dates
}

const generateBalanceData = (dates, startBalance, volatility) => {
  let balance = startBalance
  return dates.map(date => {
    const change = (Math.random() * 2 - 0.8) * volatility
    balance += change
    balance = Math.max(1000, balance)
    return {
      date,
      balance: Math.round(balance * 100) / 100
    }
  })
}

const mockData = {
  netWorthHistory: {
    week: generateBalanceData(generateDates(7), 130000, 2000),
    month: generateBalanceData(generateDates(30), 125000, 2000),
    threeMonths: generateBalanceData(generateDates(90), 120000, 3000),
    year: generateBalanceData(generateDates(365), 100000, 4000)
  },
  currentStats: {
    investments: 100000,
    cashBalance: 50000,
    liabilities: 20000,
    netWorth: 130000
  },
  // Add percentage changes for visual feedback
  percentageChanges: {
    investments: 5.2,
    cashBalance: 2.1,
    liabilities: -1.5,
    netWorth: 4.8
  },
  // Investment details
  investmentStats: {
    connectedAccounts: 3,
    totalAssets: 12,
    totalTrades: 45,
    portfolioAllocation: [
      { id: 'Stocks', label: 'Stocks', value: 60000 },
      { id: 'Crypto', label: 'Crypto', value: 25000 },
      { id: 'ETFs', label: 'ETFs', value: 15000 }
    ]
  },
  // Finance details
  financeStats: {
    lastMonthIncome: 8500,
    lastMonthSpending: 4200,
    activeAccounts: 4,
    recentTransactions: 156,
    savingsRate: 28 // percentage
  }
}

export function DashboardProvider({ children }) {
  return (
    <DashboardContext.Provider value={mockData}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboardData() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboardData must be used within a DashboardProvider')
  }
  return context
}
