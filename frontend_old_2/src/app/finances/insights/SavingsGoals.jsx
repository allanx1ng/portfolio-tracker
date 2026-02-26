"use client"

import { useState } from "react"
import { useFinancesData } from "../FinancesDataProvider"
import { formatCurrency } from "@/util/util"

const SavingsGoals = () => {
  const { bankAccounts, monthlyStats } = useFinancesData()
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
  
  const [showNewGoalForm, setShowNewGoalForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    targetDate: "",
    linkedAccountId: "",
    description: "",
    priority: "Medium",
    color: "#4F46E5"
  })
  
  // Calculate monthly contribution needed to reach goal by target date
  const calculateMonthlyContribution = (goal) => {
    const today = new Date()
    const targetDate = new Date(goal.targetDate)
    
    // Calculate months between now and target date
    const monthsRemaining = (targetDate.getFullYear() - today.getFullYear()) * 12 + 
                           (targetDate.getMonth() - today.getMonth())
    
    if (monthsRemaining <= 0) return 0
    
    const amountNeeded = goal.targetAmount - goal.currentAmount
    return amountNeeded / monthsRemaining
  }
  
  // Calculate progress percentage
  const calculateProgress = (goal) => {
    return (goal.currentAmount / goal.targetAmount) * 100
  }
  
  // Get linked account name
  const getLinkedAccountName = (accountId) => {
    const account = bankAccounts.find(acc => acc.id === accountId)
    return account ? account.name : "No account linked"
  }
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewGoal(prev => ({
      ...prev,
      [name]: name === "targetAmount" || name === "currentAmount" ? parseFloat(value) || 0 : value
    }))
  }
  
  // Add new goal
  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetDate) {
      alert("Please fill in all required fields")
      return
    }
    
    setGoals(prev => [
      ...prev,
      {
        ...newGoal,
        id: Date.now()
      }
    ])
    
    // Reset form
    setNewGoal({
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      targetDate: "",
      linkedAccountId: "",
      description: "",
      priority: "Medium",
      color: "#4F46E5"
    })
    
    setShowNewGoalForm(false)
  }
  
  // Delete goal
  const handleDeleteGoal = (goalId) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId))
  }
  
  // Update goal amount
  const handleUpdateAmount = (goalId, newAmount) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, currentAmount: parseFloat(newAmount) } : goal
    ))
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Savings Goals</h2>
        <button
          onClick={() => setShowNewGoalForm(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Goal
        </button>
      </div>
      
      {/* New Goal Form */}
      {showNewGoalForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Create New Savings Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name*</label>
              <input
                type="text"
                name="name"
                value={newGoal.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Vacation Fund"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount*</label>
              <input
                type="number"
                name="targetAmount"
                value={newGoal.targetAmount || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="10000"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount</label>
              <input
                type="number"
                name="currentAmount"
                value={newGoal.currentAmount || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Date*</label>
              <input
                type="date"
                name="targetDate"
                value={newGoal.targetDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Linked Account</label>
              <select
                name="linkedAccountId"
                value={newGoal.linkedAccountId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">None</option>
                {bankAccounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={newGoal.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={newGoal.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows="2"
                placeholder="What are you saving for?"
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div className="flex space-x-2">
                {["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewGoal(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full ${newGoal.color === color ? 'ring-2 ring-offset-2 ring-gray-500' : ''}`}
                    style={{ backgroundColor: color }}
                  ></button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-3">
            <button
              type="button"
              onClick={() => setShowNewGoalForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddGoal}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Goal
            </button>
          </div>
        </div>
      )}
      
      {/* Goals List */}
      <div className="space-y-6">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No savings goals yet. Create your first goal to get started!</p>
          </div>
        ) : (
          goals.map(goal => {
            const progress = calculateProgress(goal)
            const monthlyContribution = calculateMonthlyContribution(goal)
            
            return (
              <div key={goal.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{goal.name}</h3>
                      <p className="text-sm text-gray-500">{goal.description}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        goal.priority === 'High' ? 'bg-red-100 text-red-800' :
                        goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {goal.priority} Priority
                      </span>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="ml-2 text-gray-400 hover:text-gray-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Target</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(goal.targetAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current</p>
                      <div className="flex items-center">
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(goal.currentAmount)}</p>
                        <button
                          className="ml-2 text-indigo-600 hover:text-indigo-800 text-sm"
                          onClick={() => {
                            const newAmount = prompt("Update current amount:", goal.currentAmount)
                            if (newAmount !== null) {
                              handleUpdateAmount(goal.id, newAmount)
                            }
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Target Date</p>
                      <p className="text-base text-gray-900">{new Date(goal.targetDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Linked Account</p>
                      <p className="text-base text-gray-900">{getLinkedAccountName(goal.linkedAccountId)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-gray-900">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ width: `${progress}%`, backgroundColor: goal.color }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Suggested Monthly Contribution</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(monthlyContribution)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Remaining</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(goal.targetAmount - goal.currentAmount)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default SavingsGoals
