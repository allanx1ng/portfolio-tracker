import PageCointainer from "./pageCointainer"
import BackButton from "@/components/BackButton"

export default function ({ params }) {
  return (
    <div>
      <PageCointainer params={params} />
      <BackButton url={"/portfolios"} />
    </div>
  )
}
