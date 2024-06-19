
import BackButton from "@/components/BackButton"
import GetAllPortfolios from "./getAllPortfolios"
export default function() {
    return <div className="m-8">
        <h1>
            All portfolios:
        </h1>
        <GetAllPortfolios/>
        <a href="/connect/addCustom" className="btn btn-accent">Add portfolios:</a>
        <BackButton url={'/portfolio'}/>
    </div>
}