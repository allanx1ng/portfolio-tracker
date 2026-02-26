"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { bankAccounts, cards, getAccountTransactions, getAccountBalanceHistory } from "../../mockData"

// Create context
const AccountDataContext = createContext(null)

// Custom hook to use the context
export const useAccountData = () => {
  const context = useContext(AccountDataContext)
  if (!context) {
    throw new Error("useAccountData must be used within an AccountDataProvider")
  }
  return context
}

export const AccountDataProvider = ({ accountId, children }) => {
  const [account, setAccount] = useState(null)
  const [linkedCards, setLinkedCards] = useState([])
  const [balanceHistory, setBalanceHistory] = useState({})
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Load account data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Find account or card
        const foundAccount = bankAccounts.find(a => a.id === accountId)
        const foundCard = cards.find(c => c.id === accountId)
        
        if (foundAccount) {
          setAccount(foundAccount)
          // Find linked cards
          const accountLinkedCards = cards.filter(card => 
            foundAccount.linkedCards.includes(card.id)
          )
          setLinkedCards(accountLinkedCards)
        } else if (foundCard) {
          setAccount(foundCard)
          setLinkedCards([])
        } else {
          throw new Error("Account not found")
        }
        
        // Get balance history
        const history = getAccountBalanceHistory(accountId)
        setBalanceHistory(history)
        
        // Get transactions
        const accountTransactions = getAccountTransactions(accountId)
        setTransactions(accountTransactions)
        
        setIsLoading(false)
      } catch (err) {
        setError(err.message)
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [accountId])
  
  // Value to be provided by the context
  const value = {
    account,
    linkedCards,
    balanceHistory,
    transactions,
    isLoading,
    error
  }
  
  return (
    <AccountDataContext.Provider value={value}>
      {children}
    </AccountDataContext.Provider>
  )
}
