
import BackButton from "@/components/BackButton"
import GetAllPortfolios from "./getAllPortfolios"
export default function() {
    return <div className="p-8 bg-secondary text-primary">
        <h1>
            All portfolios:
        </h1>
        <GetAllPortfolios/>
        <a href="/connect/addCustom" className="btn btn-primary text-white">Add portfolios:</a>
        <BackButton url={'/portfolio'}/>
    </div>
}