"use client"

import BalanceOverview from "./BalanceOverview"
import IncomeOverview from "./IncomeOverview"
import SpendingOverview from "./SpendingOverview"
import DebtOverview from "./DebtOverview"
import { useFinancesData } from "../../../app/finances/FinancesDataProvider"

const OverviewStats = () => {
  const { monthlyStats, percentageChanges, isLoading } = useFinancesData()
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <BalanceOverview balance={monthlyStats.balance} percentChange={percentageChanges.balance} />
      <IncomeOverview income={monthlyStats.income} percentChange={percentageChanges.income} />
      <SpendingOverview spending={monthlyStats.spending} percentChange={percentageChanges.spending} />
      <DebtOverview />
    </div>
  )
}

export default OverviewStats
