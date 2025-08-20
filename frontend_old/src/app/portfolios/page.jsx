
import BackButton from "@/components/BackButton"
import GetAllPortfolios from "./getAllPortfolios"
export default function() {
    return <div className="">
        <h1 className="my-8">
            All portfolios:
        </h1>
        <GetAllPortfolios/>
        <a href="/connect" className="btn btn-primary text-white">Add portfolios:</a>
        <BackButton url={'/portfolio'}/>
    </div>
}