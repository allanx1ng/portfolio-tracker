import { PortfolioProvider } from "@/context/TotalAssetContext"
import PageContainer from "./PageContainer"

const Portfolio = () => {
  
  return (
    <PortfolioProvider>
      <PageContainer/>
    </PortfolioProvider>
  )
}

export default Portfolio
