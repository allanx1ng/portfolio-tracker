"use client"
import AddPortfolio from "./addPortfolio"
import { usePortfolios } from "@/context/PortfoliosContext"

export default function () {
  // const [reload, setReload] = useState(false)
  const { portfolios, tvl } = usePortfolios()
  console.log(portfolios)
  return (
    <div className="bg-white p-8">
      <h2>Custom portfolios:</h2>

      <div>
        {portfolios.map(
          (p) =>
            p.account_type == "custom" && (
              <li key={p.uid + p.portfolio_name}>
                <a href={`/portfolios/${p.portfolio_name}`}>{p.portfolio_name}</a>
                {/* <div>{p.account_type}</div> */}
              </li>
            )
        )}
      </div>

      <div>{/* <UserPortfolios reload={reload} /> */}</div>
      {/* <button>add custom portfolio</button> */}
      <div>
        <AddPortfolio />
      </div>
    </div>
  )
}
