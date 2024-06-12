import GetPortfolio from "./getPortfolio"
import AddAssets from "./addAssets"
import { ToastContainer } from "react-toastify"
import PageCointainer from "./pageCointainer"
import BackButton from "@/components/BackButton"

export default function ({ params }) {
  return (
    <div>
        {/* <ToastContainer/> */}
      {/* <GetPortfolio name={params.portfolio} />
      <div>assets:</div>
      <AddAssets name={params.portfolio}/> */}
      <PageCointainer params={params}/>
      <BackButton url={'/portfolios'}/>
    </div>
  )
}
