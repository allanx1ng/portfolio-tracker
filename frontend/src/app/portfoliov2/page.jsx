"use client"

import { TimeframeProvider } from "@/components/charts/line/TimeframeContext"
import DashboardLayout from "@/components/ui/DashboardLayout"
import StatCard from "@/components/ui/StatCard"
import WidgetCard from "@/components/ui/WidgetCard"
import { usePortfolio } from "@/context/TotalAssetContext"
import { usePortfolios } from "@/context/PortfoliosContext"
import { percentGainCalc, round } from "@/util/util"
import ChartDataProcessing from "./ChartDataProcessing"
import AssetClassAlloc from "../portfolio/AssetClassAlloc"
import AssetTable from "@/components/tables/AssetTable"

function PortfolioOverview() {
  const { data, tvl, contributions, loading, error } = usePortfolio()
  const { portfolios, loadingPortfolios } = usePortfolios()

  return (
    <DashboardLayout
      title="Portfolio Overview"
      isLoading={loading}
      error={error}
      hasTimeframeSelector={true}
    >
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Net Worth"
          value={tvl}
          isCurrency={true}
          color="indigo"
        />
        <StatCard
          title="Net Contributions"
          value={contributions}
          isCurrency={true}
          color="green"
        />
        <StatCard
          title="Net PNL"
          value={tvl - contributions}
          isCurrency={true}
          percentChange={percentGainCalc(tvl, contributions)}
          color={tvl - contributions >= 0 ? "green" : "red"}
        />
      </div>

      {/* Asset Distribution */}
      <div className="mb-8">
        <WidgetCard title="Asset Distribution">
          <ChartDataProcessing />
        </WidgetCard>
      </div>

      {/* Asset Allocation and Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <WidgetCard title="Asset Class Allocation">
          <div className="h-[300px] flex items-center justify-center">
            <AssetClassAlloc />
          </div>
        </WidgetCard>

        <WidgetCard title="Portfolio Summary">
          <div className="space-y-4">
            <div className="grid grid-cols-2 font-medium text-gray-600">
              <div>Portfolio</div>
              <div className="text-right">Value</div>
            </div>
            <div className="space-y-2">
              {loadingPortfolios ? (
                <div className="text-center py-4">
                  <span className="loading loading-dots loading-md"></span>
                </div>
              ) : (
                portfolios.map((portfolio, index) => {
                  if (index > 3) return null
                  return (
                    <div 
                      key={index}
                      className="grid grid-cols-2 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors"
                    >
                      <div>{portfolio.portfolio_name}</div>
                      <div className="text-right font-medium">
                        ${round(portfolio.tvl, 2)}
                      </div>
                    </div>
                  )
                })
              )}
              {portfolios.length > 4 && (
                <div className="text-center text-gray-500 mt-2">
                  {portfolios.length - 4} More
                </div>
              )}
            </div>
            <a 
              href="/portfolios" 
              className="btn btn-primary w-full text-white mt-4"
            >
              View All Portfolios
            </a>
          </div>
        </WidgetCard>
      </div>

      {/* Assets Table */}
      {data.length > 0 ? (
        <WidgetCard title="Assets">
          <AssetTable data={data} tvl={tvl} />
        </WidgetCard>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No assets found
          </h3>
          <p className="text-gray-500">
            Add some assets to get started with portfolio tracking
          </p>
        </div>
      )}
    </DashboardLayout>
  )
}

export default function PortfolioPage() {
  return (
    <TimeframeProvider>
      <PortfolioOverview />
    </TimeframeProvider>
  )
}
