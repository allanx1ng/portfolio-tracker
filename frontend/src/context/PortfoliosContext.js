"use client"

import React, { createContext, useState, useEffect } from "react"
import { getPortfolios } from "@/util/getUserPortfolios"

const PortfolioContext = createContext()

export const PortfoliosProvider = ({ children }) => {
  const [portfolios, setPortfolios] = useState([])
  const [tvl, setTvl] = useState(0)
  const [loadingPortfolios, setLoading] = useState(true)
  const [errorPortfolios, setError] = useState(false)
  useEffect(() => {
    fetchAllPortfolios()
  }, [])

  const fetchAllPortfolios = async () => {
    try {
      setError(false)
      const data = await getPortfolios()
      if (data) {
        // console.log(data.data)
        setPortfolios(data.data)
        setTvl(data.tvl)
        // setLoading(false)
      }
      // successMsg("success")
    } catch (err) {
      // errorMsg(err)
      // setLoading(false)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PortfolioContext.Provider value={{ portfolios, tvl, loadingPortfolios, errorPortfolios }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolios = () => React.useContext(PortfolioContext)
