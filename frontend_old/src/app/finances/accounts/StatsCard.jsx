"use client"

import { formatCurrency } from "@/util/util"

const StatsCard = ({ title, amount, subtitle, isNegative = false }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${isNegative ? 'text-red-600' : 'text-gray-900'}`}>
        {formatCurrency(amount)}
      </p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

export default StatsCard
