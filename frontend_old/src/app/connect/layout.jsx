import { PortfoliosProvider } from "@/context/PortfoliosContext"

export default function ({ children }) {
  return <PortfoliosProvider>{children}</PortfoliosProvider>
}
