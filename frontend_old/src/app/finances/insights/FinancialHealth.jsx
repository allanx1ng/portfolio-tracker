"use client"

import { useFinancesData } from "../FinancesDataProvider"
import { formatCurrency } from "@/util/util"

const FinancialHealth = () => {
  const { monthlyStats, percentageChanges, bankAccounts, transactions } = useFinancesData()
  
  // Calculate financial health metrics
  const calculateFinancialHealth = () => {
    // Total assets (sum of all account balances)
    const totalAssets = bankAccounts.reduce((sum, account) => sum + account.balance, 0)
    
    // Total debt
    const totalDebt = monthlyStats.debt || 0
    
    // Net worth
    const netWorth = totalAssets - totalDebt
    
    // Monthly income
    const monthlyIncome = monthlyStats.income || 0
    
    // Monthly expenses
    const monthlyExpenses = monthlyStats.spending || 0
    
    // Monthly savings
    const monthlySavings = monthlyIncome - monthlyExpenses
    
    // Savings rate (percentage of income saved)
    const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0
    
    // Debt-to-income ratio
    const debtToIncomeRatio = monthlyIncome > 0 ? (totalDebt / (monthlyIncome * 12)) * 100 : 0
    
    // Emergency fund ratio (months of expenses covered by liquid assets)
    const emergencyFundRatio = monthlyExpenses > 0 ? totalAssets / monthlyExpenses : 0
    
    return {
      totalAssets,
      totalDebt,
      netWorth,
      monthlyIncome,
      monthlyExpenses,
      monthlySavings,
      savingsRate,
      debtToIncomeRatio,
      emergencyFundRatio
    }
  }
  
  const health = calculateFinancialHealth()
  
  // Determine financial health score (0-100)
  const calculateHealthScore = () => {
    let score = 0
    
    // Savings rate score (0-25)
    // Ideal: 20%+ savings rate
    const savingsRateScore = Math.min(25, (health.savingsRate / 20) * 25)
    
    // Debt-to-income ratio score (0-25)
    // Ideal: Below 36% debt-to-income ratio
    const debtToIncomeScore = Math.min(25, (1 - health.debtToIncomeRatio / 100) * 25)
    
    // Emergency fund score (0-25)
    // Ideal: 6+ months of expenses saved
    const emergencyFundScore = Math.min(25, (health.emergencyFundRatio / 6) * 25)
    
    // Net worth score (0-25)
    // This is more subjective, but we'll use a positive net worth as a baseline
    const netWorthScore = health.netWorth > 0 ? Math.min(25, 15 + (health.netWorth / (health.monthlyIncome * 12)) * 10) : 0
    
    score = savingsRateScore + debtToIncomeScore + emergencyFundScore + netWorthScore
    
    return Math.round(score)
  }
  
  const healthScore = calculateHealthScore()
  
  // Determine health status based on score
  const getHealthStatus = (score) => {
    if (score >= 80) return { label: "Excellent", color: "text-green-500" }
    if (score >= 60) return { label: "Good", color: "text-blue-500" }
    if (score >= 40) return { label: "Fair", color: "text-yellow-500" }
    return { label: "Needs Attention", color: "text-red-500" }
  }
  
  const healthStatus = getHealthStatus(healthScore)
  
  // Generate recommendations based on financial health
  const getRecommendations = () => {
    const recommendations = []
    
    if (health.savingsRate < 15) {
      recommendations.push("Increase your savings rate to at least 15% of your income.")
    }
    
    if (health.debtToIncomeRatio > 36) {
      recommendations.push("Work on reducing your debt-to-income ratio below 36%.")
    }
    
    if (health.emergencyFundRatio < 3) {
      recommendations.push("Build your emergency fund to cover at least 3-6 months of expenses.")
    }
    
    if (health.netWorth <= 0) {
      recommendations.push("Focus on building positive net worth by paying down debt and increasing savings.")
    }
    
    return recommendations.length > 0 ? recommendations : ["Your financial health looks good! Continue your current habits."]
  }
  
  const recommendations = getRecommendations()
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Health Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <span className="text-2xl font-bold text-indigo-600">{healthScore}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Financial Health Score</p>
              <p className={`text-lg font-semibold ${healthStatus.color}`}>{healthStatus.label}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Net Worth</span>
              <span className={`text-sm font-medium ${health.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(health.netWorth)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Monthly Savings</span>
              <span className={`text-sm font-medium ${health.monthlySavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(health.monthlySavings)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Savings Rate</span>
              <span className="text-sm font-medium text-gray-900">{health.savingsRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Debt-to-Income Ratio</span>
              <span className="text-sm font-medium text-gray-900">{health.debtToIncomeRatio.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Emergency Fund</span>
              <span className="text-sm font-medium text-gray-900">{health.emergencyFundRatio.toFixed(1)} months</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Recommendations</h3>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-600">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
        <div 
          className="h-2.5 rounded-full" 
          style={{ 
            width: `${healthScore}%`,
            backgroundColor: healthScore >= 80 ? '#10B981' : healthScore >= 60 ? '#3B82F6' : healthScore >= 40 ? '#F59E0B' : '#EF4444'
          }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Needs Attention</span>
        <span>Fair</span>
        <span>Good</span>
        <span>Excellent</span>
      </div>
    </div>
  )
}

export default FinancialHealth
