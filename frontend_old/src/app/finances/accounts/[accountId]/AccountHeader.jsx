"use client"

import Link from "next/link"
import { formatCurrency } from "@/util/util"

const AccountHeader = ({ account, linkedCards }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div 
            className="w-2 h-12 rounded-full mr-4"
            style={{ backgroundColor: account.color }}
          ></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{account.name}</h1>
            <p className="text-gray-500">{account.type} • {account.accountNumber}</p>
          </div>
        </div>
        <Link 
          href="/finances/accounts" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Accounts
        </Link>
      </div>
      
      <div 
        className="bg-white rounded-2xl shadow-md p-6 border-l-4"
        style={{ borderLeftColor: account.color }}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(account.balance)}</p>
            <p className="text-xs text-gray-500 mt-1">Last updated: {new Date(account.lastUpdated).toLocaleString()}</p>
          </div>
          
          {linkedCards && linkedCards.length > 0 && (
            <div className="mt-6 md:mt-0">
              <p className="text-sm font-medium text-gray-700 mb-2">Linked Cards</p>
              {linkedCards.map(card => (
                <div key={card.id} className="flex items-center mb-1">
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: card.color }}></div>
                  <p className="text-sm text-gray-600 mr-2">{card.name}</p>
                  <p className={`text-sm font-medium ${card.balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatCurrency(card.balance)}
                  </p>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 md:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Transfer
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m-6-6h12" />
              </svg>
              Pay Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountHeader
