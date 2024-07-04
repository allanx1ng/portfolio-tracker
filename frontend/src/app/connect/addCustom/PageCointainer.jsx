"use client"
import { useState } from "react"
import AddPortfolio from "./addPortfolio"
import UserPortfolios from "./getUserPortfolios"

export default function () {
  const [reload, setReload] = useState(false)
  return (
    <div className="bg-white p-8">
      <h2>Custom portfolios:</h2>

      <div>
        <UserPortfolios reload={reload} />
      </div>
      {/* <button>add custom portfolio</button> */}
      <div>
        <AddPortfolio setReload={setReload} />
      </div>
    </div>
  )
}
