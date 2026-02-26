"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getInvestments } from "@/util/getInvestments"
import { formatCurrency, formatNumber } from "@/util/format"
import StatCard from "@/components/ui/StatCard"
import WidgetCard from "@/components/ui/WidgetCard"
import PieChart from "@/components/charts/PieChart"

export default function DashboardPage() {
  const [investmentData, setInvestmentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInvestments()
        setInvestmentData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-action-primary"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-action-danger">Failed to load investments: {error}</p>
      </div>
    )
  }

  const overview = investmentData?.overallPortfolioOverview || {}
  const institutions = investmentData?.institutions || []

  // Aggregate all holdings across institutions
  const holdingsForChart = []
  const holdingsMap = {}
  const uniqueHoldings = new Set()
  let totalAccounts = 0

  institutions.forEach(inst => {
    const accounts = inst.data?.processed || []
    totalAccounts += accounts.length

    const holdings = inst.data?.portfolioOverview?.holdings || []
    holdings.forEach(holding => {
      const key = holding.ticker || holding.name
      uniqueHoldings.add(key)

      if (holding.is_cash_equivalent) return

      const value = holding.currentPrice * holding.totalQuantity
      const costBasis = holding.averageBuyPrice * holding.totalQuantity

      if (holdingsMap[key]) {
        holdingsMap[key].totalQuantity += holding.totalQuantity
        holdingsMap[key].totalValue += value
        holdingsMap[key].totalCostBasis += costBasis
      } else {
        holdingsMap[key] = {
          ticker: holding.ticker,
          name: holding.name,
          type: holding.type,
          currentPrice: holding.currentPrice,
          totalQuantity: holding.totalQuantity,
          totalValue: value,
          totalCostBasis: costBasis,
        }
      }

      // Pie chart data
      const existing = holdingsForChart.find(h => h.label === key)
      if (existing) {
        existing.value += value
      } else {
        holdingsForChart.push({ label: key, value })
      }
    })
  })

  // Build sorted holdings list with computed fields
  const allHoldings = Object.values(holdingsMap)
    .map(h => ({
      ...h,
      avgCostBasis: h.totalCostBasis / h.totalQuantity,
      gain: h.totalValue - h.totalCostBasis,
      gainPercent: h.totalCostBasis === 0 ? 0 : ((h.totalValue - h.totalCostBasis) / h.totalCostBasis) * 100,
    }))
    .sort((a, b) => b.totalValue - a.totalValue)

  // Top 3 institutions by total value
  const topInstitutions = [...institutions]
    .map(inst => ({
      ...inst,
      totalValue: inst.data?.portfolioOverview?.overall?.totalAccountValue || 0
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 3)

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
          percentChange={overview.totalPortfolioGainPercentage}
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
              <p className="text-3xl font-bold text-text-primary">{institutions.length}</p>
              <p className="text-sm text-text-secondary mt-1">Institutions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-text-primary">{totalAccounts}</p>
              <p className="text-sm text-text-secondary mt-1">Accounts</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-text-primary">{uniqueHoldings.size}</p>
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
              {institutions.length > 3 && (
                <Link
                  href="/test-connection/portfolio"
                  className="block text-center text-sm text-action-primary hover:underline mt-2"
                >
                  View all {institutions.length} institutions
                </Link>
              )}
            </div>
          )}
        </WidgetCard>
      </div>

      {/* Pie Chart */}
      <WidgetCard title="Portfolio Allocation">
        <PieChart
          data={holdingsForChart}
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
                    <th className="pb-3 text-right">Gain/Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allHoldings.map(holding => (
                    <tr key={holding.ticker || holding.name} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-text-secondary flex-shrink-0">
                            {(holding.ticker || holding.name || "?").slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">
                              {holding.ticker || "N/A"}
                            </p>
                            <p className="text-xs text-text-secondary truncate max-w-[200px]">
                              {holding.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-right text-sm text-text-primary whitespace-nowrap">
                        {formatCurrency(holding.currentPrice)}
                      </td>
                      <td className="py-3 pr-4 text-right text-sm text-text-primary whitespace-nowrap">
                        {formatCurrency(holding.avgCostBasis)}
                      </td>
                      <td className="py-3 pr-4 text-right text-sm text-text-primary whitespace-nowrap">
                        {formatNumber(holding.totalQuantity, 4)}
                      </td>
                      <td className="py-3 pr-4 text-right text-sm font-semibold text-text-primary whitespace-nowrap">
                        {formatCurrency(holding.totalValue)}
                      </td>
                      <td className="py-3 text-right whitespace-nowrap">
                        <p className={`text-sm font-semibold ${holding.gain >= 0 ? 'text-action-success' : 'text-action-danger'}`}>
                          {holding.gain >= 0 ? '+' : ''}{formatCurrency(holding.gain)}
                        </p>
                        <p className={`text-xs ${holding.gain >= 0 ? 'text-action-success' : 'text-action-danger'}`}>
                          {holding.gainPercent >= 0 ? '+' : ''}{formatNumber(holding.gainPercent, 1)}%
                        </p>
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
