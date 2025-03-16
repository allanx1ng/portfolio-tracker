"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/util/util"
import { mockDebtData } from "./DebtOverview"

const DebtBreakdown = () => {
  const [debtData, setDebtData] = useState({
    creditCards: 0,
    mortgage: 0,
    studentLoans: 0,
    carLoan: 0
  })
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    setDebtData(mockDebtData)
  }, [])
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Debt Breakdown</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium text-gray-700">Credit Cards</span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-red-400 h-2 rounded-full" 
                style={{ width: `${(debtData.creditCards / debtData.totalDebt) * 100}%` }}
              ></div>
            </div>
          </div>
          <span className="text-sm font-medium">{formatCurrency(debtData.creditCards)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium text-gray-700">Mortgage</span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-blue-400 h-2 rounded-full" 
                style={{ width: `${(debtData.mortgage / debtData.totalDebt) * 100}%` }}
              ></div>
            </div>
          </div>
          <span className="text-sm font-medium">{formatCurrency(debtData.mortgage)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium text-gray-700">Student Loans</span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-green-400 h-2 rounded-full" 
                style={{ width: `${(debtData.studentLoans / debtData.totalDebt) * 100}%` }}
              ></div>
            </div>
          </div>
          <span className="text-sm font-medium">{formatCurrency(debtData.studentLoans)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium text-gray-700">Car Loan</span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-yellow-400 h-2 rounded-full" 
                style={{ width: `${(debtData.carLoan / debtData.totalDebt) * 100}%` }}
              ></div>
            </div>
          </div>
          <span className="text-sm font-medium">{formatCurrency(debtData.carLoan)}</span>
        </div>
      </div>
    </div>
  )
}

export default DebtBreakdown
