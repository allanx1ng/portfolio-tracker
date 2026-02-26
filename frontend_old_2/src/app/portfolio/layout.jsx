import { PortfolioProvider } from "@/context/TotalAssetContext"
import { PortfoliosProvider } from "@/context/PortfoliosContext"
import { InvestmentsProvider } from "@/context/InvestmentsContext"

export default function Layout({ children }) {
  return (
    // <PortfolioProvider>
    //   <PortfoliosProvider>
    <InvestmentsProvider>
      {children}
    </InvestmentsProvider>

    //   </PortfoliosProvider>
    // </PortfolioProvider>
  )
}
