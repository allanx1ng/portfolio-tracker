"use client"
import { useState, useEffect } from "react"
import GetPortfolio from "./getPortfolio"
import AddAssets from "./addAssets"
import Error from "./error"

export default function ({ params }) {
  const [reload, setReload] = useState(false)
  const [error, setError] = useState(false)

  return error ? (
    <Error error={error} />
  ) : (
    <div>
      {/* <ToastContainer/> */}
      <GetPortfolio name={params.portfolio} reload={reload} error={error} setError={setError}/>
      <div>assets:</div>
      <AddAssets name={params.portfolio} setReload={setReload} />
    </div>
  )
}
