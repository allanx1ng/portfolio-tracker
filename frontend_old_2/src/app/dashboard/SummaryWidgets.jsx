"use client"

import Link from "next/link"
import { useDashboardData } from "./DashboardProvider"
import RechartsPieChart from "@/components/charts/pie/RechartsPieChart"
import { formatCurrency } from "@/util/util"
import WidgetCard from "@/components/ui/WidgetCard"

const StatsBox = ({ label, value, isCurrency = true }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <div className="text-sm text-gray-500 mb-1">{label}</div>
    <div className="text-lg font-semibold text-gray-900">
      {isCurrency ? formatCurrency(value) : value}
    </div>
  </div>
)

const StatsList = ({ items }) => (
  <div className="divide-y divide-gray-200">
    {items.map((item, index) => (
      <div key={index} className="flex justify-between items-center py-2">
        <span className="text-gray-600">{item.label}</span>
        <span className="font-medium text-gray-900">
          {item.isPercentage ? `${item.value}%` :
           item.isCurrency ? formatCurrency(item.value) :
           item.value}
        </span>
      </div>
    ))}
  </div>
)

export default function SummaryWidgets() {
  const { investmentStats, financeStats } = useDashboardData()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* Investment Summary */}
      <WidgetCard title="Investment Overview">
        <div className="grid grid-cols-2 gap-6">
          <div className="h-48">
            <RechartsPieChart data={investmentStats.portfolioAllocation} />
          </div>
          <div>
            <StatsList items={[
              { label: "Connected Accounts", value: investmentStats.connectedAccounts },
              { label: "Assets Held", value: investmentStats.totalAssets },
              { label: "Total Trades", value: investmentStats.totalTrades }
            ]} />
          </div>
        </div>
      </WidgetCard>

      {/* Finance Summary */}
      <WidgetCard title="Finance Overview">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <StatsBox
              label="Last Month Income"
              value={financeStats.lastMonthIncome}
              isCurrency={true}
            />
            <StatsBox
              label="Last Month Spending"
              value={financeStats.lastMonthSpending}
              isCurrency={true}
            />
          </div>

          <StatsList items={[
            { label: "Active Accounts", value: financeStats.activeAccounts },
            { label: "Recent Transactions", value: financeStats.recentTransactions },
            { label: "Savings Rate", value: financeStats.savingsRate, isPercentage: true }
          ]} />
        </div>
      </WidgetCard>
    </div>
  )
}
