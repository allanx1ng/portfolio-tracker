"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useFinancesData, FinancesDataProvider } from "../FinancesDataProvider"
import StatsCard from "./StatsCard"
import InstitutionSection from "./InstitutionSection"
import PlaidConnect from "@/components/Stocks/PlaidLink"
import { successMsg } from "@/util/toastNotifications"
import { Button, LinkButton } from '@/components/ui/buttons'
import apiClient from "@/util/apiClient"

// Component that uses the finances data context
function AccountsContent() {
  const { bankAccounts, cards, isLoading } = useFinancesData()
  const [showPlaidConnect, setShowPlaidConnect] = useState(false)
  
  // Group accounts by institution
  const accountsByInstitution = bankAccounts?.reduce((acc, account) => {
    if (!acc[account.institution]) {
      acc[account.institution] = []
    }
    acc[account.institution].push(account)
    return acc
  }, {})
  
  // Calculate total balance across all accounts
  const totalBalance = bankAccounts?.reduce((sum, account) => sum + account.balance, 0) || 0
  
  // Calculate total debt across all credit cards
  const totalDebt = cards?.length
    ? cards
      .filter(card => card.type === "Credit Card")
      .reduce((sum, card) => sum + Math.abs(card.balance), 0)
    : 0
  
  // Handle successful Plaid connection
  const handlePlaidSuccess = useCallback((response) => {
    successMsg('Account connected successfully! Syncing transactions...')
    setShowPlaidConnect(false)
    // We could trigger a refresh of the financial data here
  }, [])
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Connected Accounts</h1>
          <Link href="/finances" passHref>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              }
            >
              Back to Dashboard
            </Button>
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
        
        {/* Add Account Button and Connect UI */}
        <div className="mt-8 text-center">
          {showPlaidConnect ? (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Connect a Bank Account</h3>
              <p className="text-sm text-gray-500 mb-6">
                Connect securely to your bank to import transactions and account balances.
              </p>
              
              <PlaidConnect
                buttonText="Connect Bank Account"
                variant="primary"
                size="lg"
                onSuccess={handlePlaidSuccess}
              />
              
              <LinkButton
                color="gray"
                className="mt-4"
                onClick={() => setShowPlaidConnect(false)}
              >
                Cancel
              </LinkButton>
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={() => setShowPlaidConnect(true)}
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            >
              Connect New Account
            </Button>
          )}

          <Button onClick={() => apiClient.get('/test/sync-investments', { params: {institution_id: 'ins_38' }})}>
            display holdings
          </Button>
        </div>
      </div>
    </div>
  )
}

// Wrapper component that provides the data context
export default function AccountsPage() {
  return (
    <FinancesDataProvider>
      <AccountsContent />
    </FinancesDataProvider>
  )
}
