"use client"

import { useState, useEffect } from "react"
import { getPortfolios } from "@/util/getUserPortfolios"
import { errorMsg, successMsg } from "@/util/toastNotifications"
import Loading from "./loading"
import { ToastContainer } from "react-toastify"

export default function getAllPortfolios() {
  useEffect(() => {
    fetchAllPortfolios()
  }, [])
  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAllPortfolios = async () => {
    try {
      const data = await getPortfolios()
      setPortfolios(data)
      setLoading(false)
    } catch (err) {
      errorMsg(err)
    }
  }

  return loading ? (
    <Loading />
  ) : (
    <div>
      <ToastContainer />
      {portfolios.map((p) => (
        <li key={p.uid + p.portfolio_name}>
          <a href={`/portfolios/${p.portfolio_name}`}>{p.portfolio_name}</a>
          {/* <div>{p.account_type}</div> */}
        </li>
      ))}
    </div>
  )
}
