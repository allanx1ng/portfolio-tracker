"use client"

import Link from "next/link"
import { DashboardProvider, useDashboardData } from "./DashboardProvider"
import DashboardStats from "./DashboardStats"
import SummaryWidgets from "./SummaryWidgets"
import DashboardLayout from "@/components/ui/DashboardLayout"
import RechartsBalanceChart from "@/components/charts/line/RechartsBalanceChart"

function Dashboard() {
  const { netWorthHistory, currentStats, isLoading, error } = useDashboardData()

  return (
    <DashboardLayout
      title="Combined Dashboard"
      isLoading={isLoading}
      error={error}
      hasTimeframeSelector={true}
    >
      {/* Net Worth Headline */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-500">Total Net Worth</h2>
        <div className="mt-2 flex items-baseline">
          <p className="text-4xl font-bold text-gray-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(currentStats.netWorth)}
          </p>
        </div>
      </div>

      {/* Net Worth Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <RechartsBalanceChart balanceHistory={netWorthHistory} />
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Summary Widgets */}
      <SummaryWidgets />
    </DashboardLayout>
  )
}

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  )
}
