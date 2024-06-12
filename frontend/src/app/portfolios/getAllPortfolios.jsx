"use client"

import { useState, useEffect } from "react"
import { getPortfolios } from "@/util/getUserPortfolios"
import { errorMsg, successMsg } from "@/util/toastNotifications"
import Loading from "./loading"
import { round } from "@/util/util"

export default function getAllPortfolios() {
  useEffect(() => {
    fetchAllPortfolios()
  }, [])
  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchAllPortfolios = async () => {
    try {
      setError(false)
      const data = await getPortfolios()
      setPortfolios(data)
      setLoading(false)
      successMsg("success")
    } catch (err) {
      errorMsg(err)
      setLoading(false)
      setError(true)
    }
  }

  return loading ? (
    <Loading />
  ) : error ? (
    <div>error 404</div>
  ) : (
    <div>
      {/* <ToastContainer /> */}
      {portfolios.length == 0 ? (
        <div>no portfolios yet, add one to get started</div>
      ) : (
        portfolios.map((p, idx) => (
          <li key={idx}>
            <a href={`/portfolios/${p.portfolio_name}`}>{p.portfolio_name + " " + round(p.tvl, 2)}</a>
            {/* <div>{p.account_type}</div> */}
          </li>
        ))
      )}
    </div>
  )
}
