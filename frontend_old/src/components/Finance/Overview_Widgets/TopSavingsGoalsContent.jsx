"use client"

import { formatCurrency } from "@/util/util"

// Mock data - in a real app, this would come from the FinancesDataProvider
const mockGoals = [
  {
    id: 1,
    name: "Emergency Fund",
    target: 10000,
    current: 7500,
    color: "#10B981" // green
  },
  {
    id: 2,
    name: "House Down Payment",
    target: 50000,
    current: 15000,
    color: "#6366F1" // indigo
  },
  {
    id: 3,
    name: "Vacation",
    target: 5000,
    current: 2500,
    color: "#F59E0B" // amber
  }
]

const GoalRow = ({ name, current, target, color }) => (
  <div className="py-2">
    <div className="flex justify-between mb-1">
      <span className="text-sm text-gray-700">{name}</span>
      <span className="text-sm font-medium text-gray-900">
        {formatCurrency(current)} / {formatCurrency(target)}
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="h-2 rounded-full"
        style={{
          width: `${(current / target) * 100}%`,
          backgroundColor: color
        }}
      ></div>
    </div>
  </div>
)

const TopSavingsGoalsContent = () => {
  return (
    <div className="space-y-4">
      {mockGoals.map((goal) => (
        <GoalRow
          key={goal.id}
          name={goal.name}
          current={goal.current}
          target={goal.target}
          color={goal.color}
        />
      ))}
    </div>
  )
}

export default TopSavingsGoalsContent
