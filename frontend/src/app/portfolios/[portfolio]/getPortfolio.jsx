"use client"

import { getPortfolio } from "@/util/getUserPortfolios"
import { errorMsg, successMsg } from "@/util/toastNotifications"
import { useState, useEffect } from "react"
import { ToastContainer } from "react-toastify"
import Loading from "../loading"
import Error from "./error"

export default function ({ name, reload, error, setError }) {
  useEffect(() => {
    if (reload) {
      fetchPortfolio()
    }
  }, [reload])
  useEffect(() => {
    fetchPortfolio()
  }, [])
  const [loading, setLoading] = useState(true)
  // const [error, setError] = useState(false)

  const [portfolio, setPortfolio] = useState()

  const fetchPortfolio = async () => {
    try {
      const data = await getPortfolio(name)
      if (data) {
        // console.log(data)
        setPortfolio(data)
        setError(false)
        // setLoading(false)
      }
    } catch (err) {
      // console.log(err)
      errorMsg(err.response.status)
      setError(err.response.status)
      // setLoading(false)
    } finally {
      setLoading(false)
    }
  }
  return loading ? (
    <Loading />
  ) : portfolio.length == 0 ? (
    <Error error={204}/> 
    // <div></div>
  ) : (
    <div>
      {/* <ToastContainer /> */}
      <h1>{portfolio.portfolio_data.portfolio_name}</h1>
      <div>{portfolio.portfolio_data.account_type}</div>
      <div>TVL: {portfolio.tvl}</div>
      <div>Total Contributions: {portfolio.contributions}</div>
      {portfolio.assets.map((asset) => (
        <div key={asset.asset_ticker}>
          {asset.asset_name} {parseFloat(asset.amount).toFixed(2)}{" "}
          {parseFloat(asset.avg_price).toFixed(2)}
        </div>
      ))}
    </div>
  )
}
