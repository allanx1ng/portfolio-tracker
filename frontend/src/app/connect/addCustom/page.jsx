import PageCointainer from "./PageCointainer"
import BackButton from "@/components/BackButton"

export default async function () {
  return (
    <>
      <PageCointainer />
      <BackButton url={"/portfolios"} />
    </>
  )
}
