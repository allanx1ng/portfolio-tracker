"use client"

import React, { createContext, useState, useEffect } from "react"
import { getPortfolio } from "@/util/getUserPortfolios"

const PortfolioContext = createContext()

export const PortfolioProvider = ({ children, name }) => {
  const [portfolio, setPortfolio] = useState([])
  const [data, setData] = useState([])
  const [tvl, setTvl] = useState(0)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(false)
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

  useEffect(() => {
    // console.log("processing assets")
    processAssets()
  }, [portfolio])

  // useEffect(() => {
  //   if (doSort) {
  //     switch (sort) {
  //       case "Value":
  //       default:
  //         sortData()
  //     }
  //   }
  // }, [data, sort])

  const processAssets = () => {
    if (portfolio.coindata || portfolio.stockdata) {
      const tempCoins = [...portfolio.coindata]
      const tempStocks = [...portfolio.stockdata]
      const combinedData = [...tempCoins, ...tempStocks]
      // console.log(combinedData)
      setData(combinedData)
    }
  }
  // const [error, setError] = useState(false)

  // const [portfolio, setPortfolio] = useState()

  const fetchPortfolio = async () => {
    try {
      const data = await getPortfolio(name)
      if (data) {
        // console.log(data)
        setPortfolio(data)
        // console.log(data.tvl)
        setTvl(data.tvl)
        setError(false)
        // setLoading(false)
      }
    } catch (err) {
      console.log(err)
      if (err.response && err.response.status) {
        // errorMsg(err.response.status)
        setError(err.response.status)
      } else {
        // errorMsg(err.message)
        console.log(err.message)
      }
      // errorMsg(errerr.response.status)
      // setError(err.response.status)
      // setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PortfolioContext.Provider value={{ portfolio, data, tvl, loading, error, setReload }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = () => React.useContext(PortfolioContext)
