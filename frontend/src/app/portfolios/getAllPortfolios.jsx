"use client"

import { useState, useEffect } from "react"
import { getPortfolios } from "@/util/getUserPortfolios"
import { errorMsg, successMsg } from "@/util/toastNotifications"
import Loading from "./loading"
import { round } from "@/util/util"
import PortfolioTable from "@/components/tables/PortfolioTable"

export default function getAllPortfolios() {
  useEffect(() => {
    fetchAllPortfolios()
  }, [])
  const [portfolios, setPortfolios] = useState([])
  const [tvl, setTvl] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchAllPortfolios = async () => {
    try {
      setError(false)
      const data = await getPortfolios()
      setPortfolios(data.data)
      setTvl(data.tvl)
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
        <PortfolioTable data={portfolios} tvl={tvl}/>
       
      )}
    </div>
  )
}
