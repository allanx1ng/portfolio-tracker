import GetPortfolio from "./getPortfolio";



export default function ({params}) {
    return <div>
       <GetPortfolio name={params.portfolio}/>
    </div>
}