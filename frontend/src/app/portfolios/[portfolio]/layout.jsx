import { PortfolioProvider } from "@/context/IndividualPortfolioAssetContext"

export default function ({ children, params }) {
  return (
    <>
      <PortfolioProvider name={params.portfolio}>
        <div className="bg-white top-0">{children}</div>
      </PortfolioProvider>
    </>
  )
}
