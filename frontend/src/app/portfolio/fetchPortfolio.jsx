"use client"

import { useEffect, useState } from "react"
import apiClient from "@/util/apiClient"


export default function ({
  data,
  setData,
  setTvl,
  setContributions,
  setError
}) {
  // const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  

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
      } else {
        // errorMsg(err)
        // setError(response.status)
        console.log("error fetching data" + response.status)
      }
    } catch (err) {
      console.log("error fetching data" + err)
      if (err.response.status) {
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

  return loading && <span className="loading loading-dots loading-md"></span>
}
