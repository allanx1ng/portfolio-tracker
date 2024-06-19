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
      // successMsg("success")
    } catch (err) {
      // errorMsg(err)
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
        <div>No portfolios yet, add one to get started</div>
      ) : (
        portfolios.map((p, idx) => (
          <div key={idx} className="grid grid-cols-1 p-4">
            <a href={`/portfolios/${p.portfolio_name}`} className="btn btn-primary w-100px">{p.portfolio_name + "\n" + round(p.tvl, 2)}</a>
            {/* <div>{p.account_type}</div> */}
          </div>
        ))
      )}
    </div>
  )
}
