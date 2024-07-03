import { PortfolioProvider } from "@/context/TotalAssetContext"
import { PortfoliosProvider } from "@/context/PortfoliosContext"

export default function ({ children }) {
  return (
    <>
      <PortfolioProvider>
        <PortfoliosProvider>
          <div className="bg-primary top-0 p-16">{children}</div>
        </PortfoliosProvider>
      </PortfolioProvider>
    </>
  )
}
