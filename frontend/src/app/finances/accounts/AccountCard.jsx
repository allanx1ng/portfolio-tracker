"use client"

import Link from "next/link"
import { formatCurrency } from "@/util/util"

const AccountCard = ({ account, linkedCards }) => {
  return (
    <Link 
      href={`/finances/accounts/${account.id}`}
      className="block"
    >
      <div 
        className="bg-white rounded-2xl shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow"
        style={{ borderLeftColor: account.color }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{account.name}</h3>
            <p className="text-sm text-gray-500">{account.type} • {account.accountNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-900">{formatCurrency(account.balance)}</p>
            <p className="text-xs text-gray-500">Available Balance</p>
          </div>
        </div>
        
        {linkedCards && linkedCards.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-2">Linked Cards</p>
            {linkedCards.map(card => (
              <div key={card.id} className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-600">{card.name}</p>
                <p className={`text-sm font-medium ${card.balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatCurrency(card.balance)}
                </p>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 text-indigo-600 text-sm font-medium">
          View Details →
        </div>
      </div>
    </Link>
  )
}

export default AccountCard
