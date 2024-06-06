"use client"

import { useEffect, useState } from "react"
import apiClient from "@/util/apiClient"
import { errorMsg } from "@/util/toastNotifications"
import { Fragment } from "react"

export default function () {
  const [data, setData] = useState([])
  const [tvl, setTvl] = useState(0)
  const [sort, setSort] = useState("Value")
  const [doSort, setDoSort] = useState(false)

  useEffect(() => {
    if (doSort) {
      switch (sort) {
        case "Value":
        default:
          sortData()
      }
    }
  }, [data, sort])

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const sortData = () => {
    if (data.length > 0) {
      const copyArray = [...data]
      copyArray.sort((a, b) => {
        return parseFloat(b.current_value) - parseFloat(a.current_value)
      })
      setDoSort(false)
      setData(copyArray)
      
      console.log(data)
    }
  }

  const fetchPortfolio = async () => {
    try {
      const response = await apiClient.get("/portfolio-all")
      console.log(response)
      if (response.status == 200) {
        setDoSort(true)
        setTvl(response.data.tvl)
        setData(response.data.data)
      } else {
        // errorMsg(err)
        console.log("error fetching data")
      }
    } catch (err) {
      console.log("error fetching data")
      // errorMsg(err)
    }
  }

  const round = (num, maxDecimals) => {
    // Convert the number to a string
    let numStr = num.toString()

    // Find the position of the decimal point
    let decimalIndex = numStr.indexOf(".")

    // If there is no decimal point, the number is an integer
    if (decimalIndex === -1) {
      return num
    }

    // Check the number of decimal places
    let decimalPlaces = numStr.length - decimalIndex - 1

    // If the number of decimal places exceeds the maximum, round it
    if (decimalPlaces > maxDecimals) {
      return Math.round(num * 10 ** maxDecimals) / 10 ** maxDecimals
    }

    // If the number of decimal places is within the limit, return the original number
    return num
  }

  return (
    <div className="mb-24">
      <div className="overflow-x-auto">
        <div className="min-w-screen bg-white shadow-md rounded my-6">
          {/* Use grid layout for equal width columns */}
          <div className="grid grid-cols-7 text-gray-600 uppercase text-sm leading-normal">
            <div className="py-3 px-6 text-left">Asset</div>
            <div className="py-3 px-6 text-left">% of portfolio</div>
            <div className="py-3 px-6 text-center">Total Value</div>
            <div className="py-3 px-6 text-center">Amount</div>
            <div className="py-3 px-6 text-center">Current Price</div>
            <div className="py-3 px-6 text-center">Avg Buy Price</div>
            <div className="py-3 px-6 text-right">All time gainz</div>
          </div>
          <div className="grid grid-cols-7 text-gray-600 text-sm font-light">
            {data.map((holding, index) => (
              <Fragment key={index}>
                <div className="py-3 px-6 text-left whitespace-nowrap">{holding.asset_name}</div>
                <div className="py-3 px-6 text-left">
                  {round((holding.current_value / tvl) * 100, 2) + "%"}
                </div>
                <div className="py-3 px-6 text-center">{round(holding.current_value, 2)}</div>
                <div className="py-3 px-6 text-center">{round(holding.total_amount, 2)}</div>
                <div className="py-3 px-6 text-center">{round(holding.current_price, 2)}</div>
                <div className="py-3 px-6 text-center">{round(holding.combined_avg_price, 2)}</div>
                <div className="py-3 px-6 text-right flex justify-center space-x-1">
                  <span>
                    {round((holding.current_value / holding.total_contributed) * 100, 2) + "%"}
                  </span>
                  <span>/</span>
                  <span className="text-green-500">
                    {"$" + round(holding.current_value - holding.total_contributed, 2)}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
