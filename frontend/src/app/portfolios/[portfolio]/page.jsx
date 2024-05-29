import GetPortfolio from "./getPortfolio"
import AddAssets from "./addAssets"

export default function ({ params }) {
  return (
    <div>
      <GetPortfolio name={params.portfolio} />
      <div>assets:</div>
      <AddAssets/>
    </div>
  )
}
