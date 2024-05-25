import apiClient from "@/util/apiClient"
import AddPortfolio from "./addPortfolio"
import UserPortfolios from "./getUserPortfolios"


export default async function () {
 
  const portfolios = [1, 2, 3, 4]

  

  return (
    <div>
      custom portfolios
      <div>
        <UserPortfolios/>
      </div>
      <button>add custom portfolio</button>
      <div>
        <AddPortfolio />
      </div>
    </div>
  )
}
