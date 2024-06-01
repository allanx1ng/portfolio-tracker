"use client"
import { useState, useEffect } from "react"
import GetPortfolio from "./getPortfolio"
import AddAssets from "./addAssets"

export default function ({params}) {
    const [reload, setReload] = useState(false)



  return (
    <div>
      {/* <ToastContainer/> */}
      <GetPortfolio name={params.portfolio} reload={reload} />
      <div>assets:</div>
      <AddAssets name={params.portfolio} setReload={setReload}/>
    </div>
  )
}
