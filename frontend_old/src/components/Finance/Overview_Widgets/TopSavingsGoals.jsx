"use client"

import { useState, useEffect } from "react"
import { useFinancesData } from "@/app/finances/FinancesDataProvider"
import { formatCurrency } from "@/util/util"
import Link from "next/link"

const TopSavingsGoals = () => {
  // Mock goals data - in a real app, this would come from the API
  // For now, we'll use this static data to match what we created in SavingsGoals.jsx
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Emergency Fund",
      targetAmount: 15000,
      currentAmount: 5000,
      targetDate: "2025-12-31",
      linkedAccountId: "chase-savings",
      description: "6 months of living expenses",
      priority: "High",
      color: "#4F46E5" // indigo
    },
    {
      id: 2,
      name: "Vacation",
      targetAmount: 3000,
      currentAmount: 1200,
      targetDate: "2025-06-30",
      linkedAccountId: "bofa-checking",
      description: "Summer trip to Europe",
      priority: "Medium",
      color: "#0EA5E9" // sky blue
    },
    {
      id: 3,
      name: "New Car",
      targetAmount: 20000,
      currentAmount: 4500,
      targetDate: "2026-03-31",
      linkedAccountId: "chase-savings",
      description: "Down payment for new vehicle",
      priority: "Medium",
      color: "#10B981" // emerald
    }
  ])
  
  const { bankAccounts } = useFinancesData()
  
  // Calculate progress percentage
  const calculateProgress = (goal) => {
    return (goal.currentAmount / goal.targetAmount) * 100
  }
  
  // Get linked account name
  const getLinkedAccountName = (accountId) => {
    const account = bankAccounts.find(acc => acc.id === accountId)
    return account ? account.name : "No account linked"
  }
  
  // Sort goals by priority and progress
  const sortedGoals = [...goals].sort((a, b) => {
    // First sort by priority (High > Medium > Low)
    const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    
    // Then sort by progress (higher progress first)
    const aProgress = calculateProgress(a)
    const bProgress = calculateProgress(b)
    return bProgress - aProgress
  })
  
  // Get top 3 goals
  const topGoals = sortedGoals.slice(0, 3)
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Top Savings Goals</h2>
        <Link 
          href="/finances/insights" 
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          View All
        </Link>
      </div>
      
      <div className="space-y-4">
        {topGoals.map(goal => {
          const progress = calculateProgress(goal)
          
          return (
            <div key={goal.id} className="border-b border-gray-100 pb-3 last:border-0">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">{goal.name}</h3>
                  <p className="text-xs text-gray-500">{getLinkedAccountName(goal.linkedAccountId)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{formatCurrency(goal.currentAmount)}</p>
                  <p className="text-xs text-gray-500">of {formatCurrency(goal.targetAmount)}</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ width: `${progress}%`, backgroundColor: goal.color }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{progress.toFixed(1)}% complete</span>
                <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
              </div>
            </div>
          )
        })}
        
        {topGoals.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No savings goals yet</p>
            <Link 
              href="/finances/insights" 
              className="text-sm text-indigo-600 hover:text-indigo-800 mt-1 inline-block"
            >
              Create your first goal
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopSavingsGoals
