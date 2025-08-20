"use client"

import React, { createContext, useState, useEffect } from "react"
import apiClient from "@/util/apiClient"

const PortfolioContext = createContext()

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState([])
  const [tvl, setTvl] = useState(0)
  const [contributions, setContributions] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get("/portfolio-all")
      // console.log(response)
      if (response.status == 200) {
        setTvl(response.data.tvl)
        setContributions(response.data.total_contributions)
        processAssets(response.data)
        // console.log(data + "TESTDATA")
      } else if (response.status == 204) {
        console.log("no assets found")
        setError(204)
      } else {
        // errorMsg(err)
        // setError(response.status)
        console.log("error fetching data" + response.status)
      }
    } catch (err) {
      console.log("error fetching data" + err)
      if (err.response && err.response.status) {
        setError(err.response.status)
      }

      // errorMsg(err)
    } finally {
      setLoading(false)
    }
  }

  const processAssets = (data) => {
    const tempCoins = [...data.coindata]
    const tempStocks = [...data.stockdata]
    const combinedData = [...tempCoins, ...tempStocks]
    setData(combinedData)
  }

  return (
    <PortfolioContext.Provider value={{ data, tvl, contributions, loading, error }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = () => React.useContext(PortfolioContext)
