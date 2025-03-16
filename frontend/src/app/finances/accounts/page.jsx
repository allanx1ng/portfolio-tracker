"use client"

import { useState } from "react"
import Link from "next/link"
import { bankAccounts, cards } from "../mockData"
import StatsCard from "./StatsCard"
import InstitutionSection from "./InstitutionSection"

export default function AccountsPage() {
  // Group accounts by institution
  const accountsByInstitution = bankAccounts.reduce((acc, account) => {
    if (!acc[account.institution]) {
      acc[account.institution] = []
    }
    acc[account.institution].push(account)
    return acc
  }, {})
  
  // Calculate total balance across all accounts
  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0)
  
  // Calculate total debt across all credit cards
  const totalDebt = cards
    .filter(card => card.type === "Credit Card")
    .reduce((sum, card) => sum + Math.abs(card.balance), 0)
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Connected Accounts</h1>
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
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatsCard 
            title="Total Balance" 
            amount={totalBalance} 
            subtitle={`Across ${bankAccounts.length} accounts`} 
          />
          
          <StatsCard 
            title="Total Credit Card Debt" 
            amount={totalDebt} 
            subtitle={`Across ${cards.filter(c => c.type === "Credit Card").length} credit cards`}
            isNegative={true}
          />
        </div>
        
        {/* Accounts by Institution */}
        {Object.entries(accountsByInstitution).map(([institution, accounts]) => (
          <InstitutionSection 
            key={institution} 
            institution={institution} 
            accounts={accounts} 
          />
        ))}
        
        {/* Add Account Button */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Connect New Account
          </button>
        </div>
      </div>
    </div>
  )
}
