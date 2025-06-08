"use client"

import { TimeframeProvider, TimeframeSelector } from "../../components/charts/line/TimeframeContext"
import WidgetCard from "@/components/ui/WidgetCard"
import OverviewStats from "../../components/Finance/Overview_Widgets/OverviewStats"
import RechartsBalanceChart from "../../components/charts/line/RechartsBalanceChart"
import RechartsPieChart from "../../components/charts/pie/RechartsPieChart"
import RecentTransactions from "../../components/Finance/Transactions/RecentTransactions"
import DebtBreakdown from "../../components/Finance/Overview_Widgets/DebtBreakdown"
import TopAccounts from "../../components/Finance/Overview_Widgets/TopAccounts"
import TopSavingsGoals from "../../components/Finance/Overview_Widgets/TopSavingsGoals"
import { FinancesDataProvider, useFinancesData } from "./FinancesDataProvider"
import Link from "next/link"

// Component that uses the finances data context
function Dashboard() {
  const { balanceHistory, spendingByCategory, isLoading, error } = useFinancesData()
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading financial data...</h1>
          <p className="text-gray-600">Please wait while we fetch your financial information.</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error loading data</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
          <div className="flex space-x-3">
            <Link 
              href="/finances/insights" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Financial Insights
            </Link>
            <Link 
              href="/finances/accounts" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              View Accounts
            </Link>
          </div>
        </div>
        
        {/* Overview Stats */}
        <OverviewStats />
        
        <TimeframeProvider>
          {/* Timeframe Selector */}
          <div className="flex justify-end mb-4">
            <TimeframeSelector />
          </div>
          
          {/* Balance Chart */}
          <RechartsBalanceChart balanceHistory={balanceHistory} />
          
          {/* Spending, Debt, Accounts, Goals and Transactions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <WidgetCard title="Spending by Category">
                <RechartsPieChart data={spendingByCategory} />
              </WidgetCard>
            </div>
            <div className="md:col-span-1">
              <DebtBreakdown />
            </div>
            <div className="md:col-span-1">
              <TopAccounts />
            </div>
            <div className="md:col-span-1">
              <TopSavingsGoals />
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="mb-8">
            <RecentTransactions />
          </div>
        </TimeframeProvider>
      </div>
    </div>
  )
}

// Wrapper component that provides the data context
export default function FinancialDashboard() {
  return (
    <FinancesDataProvider>
      <Dashboard />
    </FinancesDataProvider>
  )
}
