"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { formatCurrency, formatNumber } from "@/util/format"
import { useInvestments } from "@/context/InvestmentsContext"
import { PageSpinner } from "@/components/ui/Spinner"
import StatCard from "@/components/ui/StatCard"
import WidgetCard from "@/components/ui/WidgetCard"
import PieChart from "@/components/charts/PieChart"

export default function DashboardPage() {
  const { loading, error, ensureData, getOverallOverview, getDashboardOverview } = useInvestments()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ensureData().then(() => setReady(true)).catch(() => setReady(true))
  }, [ensureData])

  if (!ready || loading) {
    return <PageSpinner />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-action-danger">Failed to load investments: {error}</p>
      </div>
    )
  }

  const overview = getOverallOverview() || {}
  const dashboard = getDashboardOverview() || {}
  const { allHoldings = [], pieChartData = [], topInstitutions = [], totalAccounts = 0, totalInstitutions = 0, uniqueHoldings = 0 } = dashboard

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Net Worth"
          value={overview.totalAccountValue || 0}
          color="primary"
        />
        <StatCard
          title="Unrealized Gain/Loss"
          value={overview.totalPortfolioGain || 0}
          percentChange={overview.totalPortfolioGainPercentage ?? undefined}
          color={overview.totalPortfolioGain >= 0 ? "success" : "danger"}
        />
        <StatCard
          title="Cash Balance"
          value={overview.totalCashEquiv || 0}
          color="primary"
        />
      </div>

      {/* Portfolio Summary + Top Institutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Portfolio Summary */}
        <WidgetCard title="Portfolio Summary">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-text-primary">{totalInstitutions}</p>
              <p className="text-sm text-text-secondary mt-1">Institutions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-text-primary">{totalAccounts}</p>
              <p className="text-sm text-text-secondary mt-1">Accounts</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-text-primary">{uniqueHoldings}</p>
              <p className="text-sm text-text-secondary mt-1">Unique Holdings</p>
            </div>
          </div>
        </WidgetCard>

        {/* Top Institutions */}
        <WidgetCard title="Top Institutions">
          {topInstitutions.length === 0 ? (
            <p className="text-text-secondary text-sm">No institutions connected.</p>
          ) : (
            <div className="space-y-3">
              {topInstitutions.map((inst, i) => (
                <div key={inst.institution_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-text-secondary w-5">{i + 1}.</span>
                    {inst.institution_logo ? (
                      <img
                        src={`data:image/png;base64,${inst.institution_logo}`}
                        alt={inst.institution_name}
                        className="w-8 h-8 rounded"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">N/A</div>
                    )}
                    <span className="text-sm font-medium text-text-primary">{inst.institution_name}</span>
                  </div>
                  <span className="text-sm font-semibold text-text-primary">
                    {formatCurrency(inst.totalValue)}
                  </span>
                </div>
              ))}
              <Link
                href="/test-connection"
                className="block text-center text-sm text-action-primary hover:underline mt-2"
              >
                View All Accounts
              </Link>
            </div>
          )}
        </WidgetCard>
      </div>

      {/* Pie Chart */}
      <WidgetCard title="Portfolio Allocation">
        <PieChart
          data={pieChartData}
          totalLabel="Total Investment Value"
          emptyMessage="No holdings to display. Connect an account to get started."
          valueLabel="Value"
          weightLabel="Weight"
          showLegend={false}
          outerLabels
        />
      </WidgetCard>

      {/* All Holdings */}
      <div className="mt-8">
        <WidgetCard title="All Holdings">
          {allHoldings.length === 0 ? (
            <p className="text-text-secondary text-sm">No holdings to display.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs text-text-secondary uppercase tracking-wider">
                    <th className="pb-3 pr-4">Holding</th>
                    <th className="pb-3 pr-4 text-right">Price</th>
                    <th className="pb-3 pr-4 text-right">Avg Cost</th>
                    <th className="pb-3 pr-4 text-right">Shares</th>
                    <th className="pb-3 pr-4 text-right">Value</th>
                    <th className="pb-3 pr-4 text-right">% Portfolio</th>
                    <th className="pb-3 text-right">Gain/Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allHoldings.map(holding => (
                    <tr key={holding.ticker || holding.name} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${holding.isCash ? 'bg-green-50 text-action-success' : 'bg-gray-100 text-text-secondary'}`}>
                            {holding.isCash ? '$' : (holding.ticker || holding.name || "?").slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">
                              {holding.isCash ? 'Cash' : (holding.ticker || "N/A")}
                            </p>
                            <p className="text-xs text-text-secondary truncate max-w-[200px]">
                              {holding.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-right text-sm text-text-primary whitespace-nowrap">
                        {holding.isCash ? '—' : formatCurrency(holding.currentPrice)}
                      </td>
                      <td className="py-3 pr-4 text-right text-sm text-text-primary whitespace-nowrap">
                        {holding.isCash ? '—' : formatCurrency(holding.avgCostBasis)}
                      </td>
                      <td className="py-3 pr-4 text-right text-sm text-text-primary whitespace-nowrap">
                        {holding.isCash ? '—' : formatNumber(holding.totalQuantity, 4)}
                      </td>
                      <td className="py-3 pr-4 text-right text-sm font-semibold text-text-primary whitespace-nowrap">
                        {formatCurrency(holding.totalValue)}
                      </td>
                      <td className="py-3 pr-4 text-right text-sm text-text-secondary whitespace-nowrap">
                        {formatNumber(holding.portfolioPercent, 1)}%
                      </td>
                      <td className="py-3 text-right whitespace-nowrap">
                        {holding.isCash ? (
                          <span className="text-sm text-text-secondary">—</span>
                        ) : (
                          <>
                            <p className={`text-sm font-semibold ${holding.gain >= 0 ? 'text-action-success' : 'text-action-danger'}`}>
                              {holding.gain >= 0 ? '+' : ''}{formatCurrency(holding.gain)}
                            </p>
                            <p className={`text-xs ${holding.gain >= 0 ? 'text-action-success' : 'text-action-danger'}`}>
                              {holding.gainPercent >= 0 ? '+' : ''}{formatNumber(holding.gainPercent, 1)}%
                            </p>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </WidgetCard>
      </div>
    </div>
  )
}
