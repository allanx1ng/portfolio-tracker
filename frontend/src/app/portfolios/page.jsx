
import BackButton from "@/components/BackButton"
import GetAllPortfolios from "./getAllPortfolios"
export default function() {
    return <div>
        <h1>
            all portfolios:
        </h1>
        <GetAllPortfolios/>
        <a href="/connect/addCustom" className="btn btn-accent">add portfolios:</a>
        <BackButton url={'/portfolio'}/>
    </div>
}