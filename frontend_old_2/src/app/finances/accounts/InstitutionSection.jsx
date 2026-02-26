"use client"

import AccountCard from "./AccountCard"
import { cards } from "../mockData"

const InstitutionSection = ({ institution, accounts }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{institution}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(account => {
          // Find linked cards for this account
          const linkedCards = cards.filter(card => 
            account.linkedCards.includes(card.id)
          )
          
          return (
            <AccountCard 
              key={account.id} 
              account={account} 
              linkedCards={linkedCards} 
            />
          )
        })}
      </div>
    </div>
  )
}

export default InstitutionSection
