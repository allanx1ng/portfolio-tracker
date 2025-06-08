import { PortfolioProvider } from "@/context/TotalAssetContext"
import { PortfoliosProvider } from "@/context/PortfoliosContext"

export default function Layout({ children }) {
  return (
    <PortfolioProvider>
      <PortfoliosProvider>
        {children}
      </PortfoliosProvider>
    </PortfolioProvider>
  )
}
