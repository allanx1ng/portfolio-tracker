"use client"

import { useState, useEffect } from "react"
import { useFinancesData } from "../FinancesDataProvider"
import { formatCurrency } from "@/util/util"

const CashflowDisplay = () => {
  const { transactions, monthlyStats, balanceHistory } = useFinancesData()
  const [timeframe, setTimeframe] = useState("month") // week, month, threeMonths, year
  const [cashflowData, setCashflowData] = useState({
    income: [],
    expenses: [],
    netCashflow: [],
    categories: {}
  })
  
  // Process transactions to get cashflow data
  useEffect(() => {
    if (!transactions || transactions.length === 0) return
    
    // Get date range based on timeframe
    const today = new Date()
    let startDate = new Date(today)
    
    switch (timeframe) {
      case "week":
        startDate.setDate(today.getDate() - 7)
        break
      case "month":
        startDate.setMonth(today.getMonth() - 1)
        break
      case "threeMonths":
        startDate.setMonth(today.getMonth() - 3)
        break
      case "year":
        startDate.setFullYear(today.getFullYear() - 1)
        break
      default:
        startDate.setMonth(today.getMonth() - 1)
    }
    
    startDate = startDate.toISOString()
    
    // Filter transactions within the date range
    const filteredTransactions = transactions.filter(t => t.date >= startDate)
    
    // Group transactions by date
    const transactionsByDate = {}
    const categoryTotals = {}
    
    filteredTransactions.forEach(transaction => {
      const date = transaction.date.split('T')[0]
      
      if (!transactionsByDate[date]) {
        transactionsByDate[date] = {
          income: 0,
          expenses: 0
        }
      }
      
      if (transaction.amount > 0) {
        transactionsByDate[date].income += transaction.amount
      } else {
        transactionsByDate[date].expenses += Math.abs(transaction.amount)
        
        // Track expenses by category
        const category = transaction.category
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0
        }
        categoryTotals[category] += Math.abs(transaction.amount)
      }
    })
    
    // Convert to arrays for charts
    const dates = Object.keys(transactionsByDate).sort()
    const income = dates.map(date => ({
      date,
      amount: transactionsByDate[date].income
    }))
    
    const expenses = dates.map(date => ({
      date,
      amount: transactionsByDate[date].expenses
    }))
    
    const netCashflow = dates.map(date => ({
      date,
      amount: transactionsByDate[date].income - transactionsByDate[date].expenses
    }))
    
    setCashflowData({
      income,
      expenses,
      netCashflow,
      categories: categoryTotals
    })
  }, [transactions, timeframe])
  
  // Calculate monthly recurring expenses
  const calculateRecurringExpenses = () => {
    if (!transactions || transactions.length === 0) return []
    
    const today = new Date()
    const threeMonthsAgo = new Date(today)
    threeMonthsAgo.setMonth(today.getMonth() - 3)
    
    const filteredTransactions = transactions.filter(t => 
      t.date >= threeMonthsAgo.toISOString() && t.amount < 0
    )
    
    // Group by description and count occurrences
    const expensesByDescription = {}
    
    filteredTransactions.forEach(transaction => {
      const key = `${transaction.description}-${transaction.category}`
      
      if (!expensesByDescription[key]) {
        expensesByDescription[key] = {
          description: transaction.description,
          category: transaction.category,
          occurrences: 0,
          totalAmount: 0,
          transactions: []
        }
      }
      
      expensesByDescription[key].occurrences++
      expensesByDescription[key].totalAmount += Math.abs(transaction.amount)
      expensesByDescription[key].transactions.push(transaction)
    })
    
    // Filter for recurring expenses (3+ occurrences in 3 months)
    const recurringExpenses = Object.values(expensesByDescription)
      .filter(expense => expense.occurrences >= 3)
      .map(expense => ({
        ...expense,
        averageAmount: expense.totalAmount / expense.occurrences
      }))
      .sort((a, b) => b.averageAmount - a.averageAmount)
    
    return recurringExpenses
  }
  
  const recurringExpenses = calculateRecurringExpenses()
  
  // Calculate total monthly recurring expenses
  const totalRecurringExpenses = recurringExpenses.reduce(
    (sum, expense) => sum + expense.averageAmount,
    0
  )
  
  // Calculate income vs expenses
  const totalIncome = monthlyStats.income || 0
  const totalExpenses = monthlyStats.spending || 0
  const netIncome = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0
  
  // Calculate expense breakdown by category
  const expenseCategories = Object.entries(cashflowData.categories)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
  
  // Calculate total expenses from categories
  const totalCategoryExpenses = expenseCategories.reduce(
    (sum, category) => sum + category.amount,
    0
  )
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Cashflow Analysis</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe("week")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              timeframe === "week"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe("month")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              timeframe === "month"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe("threeMonths")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              timeframe === "threeMonths"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            3 Months
          </button>
          <button
            onClick={() => setTimeframe("year")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              timeframe === "year"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Income vs Expenses Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Income vs Expenses</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Monthly Income</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Monthly Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Net Income</p>
            <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netIncome)}
            </p>
          </div>
        </div>
        
        {/* Income vs Expenses Bar Chart */}
        <div className="h-64 flex items-end space-x-16 justify-center mb-4">
          <div className="flex flex-col items-center">
            <div 
              className="w-24 bg-blue-500 rounded-t-lg" 
              style={{ height: `${(totalIncome / Math.max(totalIncome, totalExpenses)) * 200}px` }}
            ></div>
            <p className="mt-2 text-sm font-medium text-gray-700">Income</p>
            <p className="text-sm text-gray-500">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className="w-24 bg-red-500 rounded-t-lg" 
              style={{ height: `${(totalExpenses / Math.max(totalIncome, totalExpenses)) * 200}px` }}
            ></div>
            <p className="mt-2 text-sm font-medium text-gray-700">Expenses</p>
            <p className="text-sm text-gray-500">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className={`w-24 ${netIncome >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded-t-lg`} 
              style={{ 
                height: `${(Math.abs(netIncome) / Math.max(totalIncome, totalExpenses)) * 200}px`,
                marginTop: netIncome < 0 ? '0' : 'auto'
              }}
            ></div>
            <p className="mt-2 text-sm font-medium text-gray-700">Net</p>
            <p className="text-sm text-gray-500">{formatCurrency(netIncome)}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Savings Rate</p>
            <p className="text-lg font-semibold text-gray-900">{savingsRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Recommended Savings Rate</p>
            <p className="text-lg font-semibold text-gray-900">20%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className={`text-lg font-semibold ${
              savingsRate >= 20 ? 'text-green-600' : 
              savingsRate >= 10 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {savingsRate >= 20 ? 'On Track' : 
               savingsRate >= 10 ? 'Needs Improvement' : 
               'At Risk'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Expense Breakdown</h3>
          
          <div className="space-y-4">
            {expenseCategories.slice(0, 5).map(category => {
              const percentage = totalCategoryExpenses > 0 
                ? (category.amount / totalCategoryExpenses) * 100 
                : 0
              
              return (
                <div key={category.category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                    <span className="text-sm text-gray-500">
                      {formatCurrency(category.amount)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-indigo-600" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
            
            {expenseCategories.length > 5 && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Other</span>
                  <span className="text-sm text-gray-500">
                    {formatCurrency(
                      expenseCategories
                        .slice(5)
                        .reduce((sum, category) => sum + category.amount, 0)
                    )}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full bg-gray-400" 
                    style={{ 
                      width: `${
                        totalCategoryExpenses > 0 
                          ? (expenseCategories
                              .slice(5)
                              .reduce((sum, category) => sum + category.amount, 0) / 
                             totalCategoryExpenses) * 100
                          : 0
                      }%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Recurring Expenses */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Recurring Expenses</h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500">Total Monthly Recurring</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalRecurringExpenses)}</p>
            <p className="text-xs text-gray-500">
              {totalExpenses > 0 
                ? `${((totalRecurringExpenses / totalExpenses) * 100).toFixed(1)}% of monthly expenses`
                : ''}
            </p>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recurringExpenses.slice(0, 10).map((expense, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-800">{expense.description}</p>
                  <p className="text-xs text-gray-500">{expense.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{formatCurrency(expense.averageAmount)}/mo</p>
                  <p className="text-xs text-gray-500">{expense.occurrences} payments</p>
                </div>
              </div>
            ))}
            
            {recurringExpenses.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No recurring expenses detected</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Cashflow Optimization */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Cashflow Optimization</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Potential Savings</h4>
            <ul className="space-y-2">
              {recurringExpenses.slice(0, 3).map((expense, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{expense.description}</span> - 
                      Consider reviewing this {expense.category.toLowerCase()} expense 
                      ({formatCurrency(expense.averageAmount)}/mo)
                    </p>
                  </div>
                </li>
              ))}
              
              {savingsRate < 20 && (
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Increase savings rate</span> - 
                      Try to save at least 20% of your income (currently {savingsRate.toFixed(1)}%)
                    </p>
                  </div>
                </li>
              )}
              
              {expenseCategories.length > 0 && (
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Reduce {expenseCategories[0].category} spending</span> - 
                      Your highest expense category ({formatCurrency(expenseCategories[0].amount)}/mo)
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Recommendations</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">50/30/20 Rule</span> - 
                    Allocate 50% to needs, 30% to wants, and 20% to savings
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Automate savings</span> - 
                    Set up automatic transfers to savings accounts on payday
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Review subscriptions</span> - 
                    Cancel unused services and negotiate bills
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Emergency fund</span> - 
                    Build up 3-6 months of expenses in a liquid savings account
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Cashflow Projection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Cashflow Projection</h3>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Based on your current income and spending patterns, here's your projected cashflow for the next 6 months:
          </p>
          
          {/* Simple projection chart */}
          <div className="h-64 relative">
            <div className="absolute inset-0 flex items-end">
              {[1, 2, 3, 4, 5, 6].map(month => {
                const projectedIncome = totalIncome * (1 + (month * 0.005))
                const projectedExpenses = totalExpenses * (1 + (month * 0.003))
                const projectedNet = projectedIncome - projectedExpenses
                const isPositive = projectedNet >= 0
                
                return (
                  <div key={month} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full">
                      <div 
                        className={`w-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ 
                          height: `${Math.abs(projectedNet) / 1000}px`,
                          maxHeight: '180px',
                          marginTop: isPositive ? 'auto' : '0'
                        }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* X-axis */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
              {[1, 2, 3, 4, 5, 6].map(month => {
                const date = new Date()
                date.setMonth(date.getMonth() + month)
                return (
                  <div key={month} className="text-center">
                    {date.toLocaleDateString(undefined, { month: 'short' })}
                  </div>
                )
              })}
            </div>
            
            {/* Y-axis reference line */}
            <div className="absolute left-0 right-0 top-1/2 border-t border-gray-200 border-dashed"></div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div>
              <span className="inline-block w-3 h-3 bg-green-500 mr-1"></span>
              <span className="text-gray-600">Positive Net Cashflow</span>
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-red-500 mr-1"></span>
              <span className="text-gray-600">Negative Net Cashflow</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Projected 6-Month Savings</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(netIncome * 6 * 1.015)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Projected Monthly Net (Month 6)</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(totalIncome * 1.03 - totalExpenses * 1.018)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Projected Savings Rate (Month 6)</p>
            <p className="text-xl font-bold text-gray-900">
              {((1 - (totalExpenses * 1.018) / (totalIncome * 1.03)) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CashflowDisplay
