"use client"

import { useState } from "react"
import Link from "next/link"
import { FinancesDataProvider, useFinancesData } from "../FinancesDataProvider"
import SavingsGoals from "./SavingsGoals"
import DebtPaymentGoals from "./DebtPaymentGoals"
import CashflowDisplay from "./CashflowDisplay"
import FinancialHealth from "./FinancialHealth"

// Component that uses the finances data context
function InsightsContent() {
  const { isLoading, error } = useFinancesData()
  const [activeTab, setActiveTab] = useState("savings")
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading insights data...</h1>
          <p className="text-gray-600">Please wait while we analyze your financial information.</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Financial Insights</h1>
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
        
        {/* Financial Health Overview */}
        <FinancialHealth />
        
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("savings")}
                className={`${
                  activeTab === "savings"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Savings Goals
              </button>
              <button
                onClick={() => setActiveTab("debt")}
                className={`${
                  activeTab === "debt"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Debt Payment Goals
              </button>
              <button
                onClick={() => setActiveTab("cashflow")}
                className={`${
                  activeTab === "cashflow"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Cashflow Analysis
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div>
            {activeTab === "savings" && <SavingsGoals />}
            {activeTab === "debt" && <DebtPaymentGoals />}
            {activeTab === "cashflow" && <CashflowDisplay />}
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrapper component that provides the data context
export default function InsightsPage() {
  return (
    <FinancesDataProvider>
      <InsightsContent />
    </FinancesDataProvider>
  )
}
