"use client"

import { getPortfolio } from "@/util/getUserPortfolios"
import { errorMsg, successMsg } from "@/util/toastNotifications"
import { useState, useEffect } from "react"
import Loading from "../loading"
import Error from "./error"

export default function ({ name, reload, error, setError, portfolio, setPortfolio }) {
  useEffect(() => {
    // console.log(reload)
    if (reload) {
      // console.log("reloading")
      fetchPortfolio()
    }
  }, [reload])
  useEffect(() => {
    fetchPortfolio()
  }, [])
  const [loading, setLoading] = useState(true)
  // const [error, setError] = useState(false)

  // const [portfolio, setPortfolio] = useState()

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
      console.log(err)
      if (err.response && err.response.status) {
        errorMsg(err.response.status)
      } else {
        errorMsg(err.message)
      }
      // errorMsg(errerr.response.status)
      // setError(err.response.status)
      // setLoading(false)
    } finally {
      setLoading(false)
    }
  }
  return loading && <Loading />
}
