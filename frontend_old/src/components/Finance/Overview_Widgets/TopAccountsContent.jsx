"use client"

import Link from "next/link"
import { useFinancesData } from "@/app/finances/FinancesDataProvider"
import { formatCurrency } from "@/util/util"

const AccountRow = ({ name, balance, color }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center">
      <div 
        className="w-2 h-2 rounded-full mr-2"
        style={{ backgroundColor: color }}
      ></div>
      <span className="text-sm text-gray-700">{name}</span>
    </div>
    <span className="text-sm font-medium text-gray-900">
      {formatCurrency(balance)}
    </span>
  </div>
)

const TopAccountsContent = () => {
  const { bankAccounts } = useFinancesData()
  
  // Sort accounts by balance
  const sortedAccounts = [...bankAccounts]
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 4) // Show top 4 accounts
  
  return (
    <div className="space-y-2">
      {sortedAccounts.map((account) => (
        <AccountRow
          key={account.id}
          name={account.name}
          balance={account.balance}
          color={account.color}
        />
      ))}
      <div className="pt-4">
        <Link
          href="/finances/accounts"
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          View all accounts
        </Link>
      </div>
    </div>
  )
}

export default TopAccountsContent
