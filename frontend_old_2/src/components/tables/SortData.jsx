"use client"
import { percentGainCalc } from "@/util/util"
import { useState, useEffect } from "react"
export default function ({ data, displayData, setDisplayData }) {
  const [sort, setSort] = useState("Value")
  const [doSort, setDoSort] = useState(false)
  useEffect(() => {
    if (doSort) {
      sortData()
    }
  }, [sort])
  useEffect(() => {
    sortData()
  }, [data])

  const sortData = () => {
    if (data.length > 0) {
      const copyArray = [...data]
      // console.log(copyArray)
      copyArray.sort((a, b) => {
        switch (sort) {
          case "Percent":
            return (
              parseFloat(percentGainCalc(b.current_value, b.total_contributed)) -
              parseFloat(percentGainCalc(a.current_value, a.total_contributed))
            )
          case "PercentAsc":
            return (
              parseFloat(percentGainCalc(a.current_value, a.total_contributed)) -
              parseFloat(percentGainCalc(b.current_value, b.total_contributed))
            )
          case "Gain":
            return (
              parseFloat(b.current_value - b.total_contributed) -
              parseFloat(a.current_value - a.total_contributed)
            )
          case "GainAsc":
            return (
              parseFloat(percentGainCalc(a.current_value, a.total_contributed)) -
              parseFloat(percentGainCalc(b.current_value, b.total_contributed))
            )
          case "ValueAsc":
            return (
              parseFloat(a.current_value - a.total_contributed) -
              parseFloat(b.current_value - b.total_contributed)
            )
          case "Value":
          default:
            // return (
            //   parseFloat(percentGainCalc(b.current_value, b.total_contributed)) -
            //   parseFloat(percentGainCalc(a.current_value, a.total_contributed))
            // )
            return parseFloat(b.current_value) - parseFloat(a.current_value)
        }
      })
      setDoSort(false)
      setDisplayData(copyArray)

      // console.log(data)
    }
  }

  return (
    <>
      <div className="dropdown dropdown-end ">
        <summary tabIndex={0} className="btn btn-sm m-1 text-black btn-ghost" role="button">Sort: {sort}</summary>
        <ul tabIndex={0} className={"menu dropdown-content relative bg-base-100 rounded-box z-[1] w-52 p-2 shadow"}>
          <li
            onClick={() => {
              setSort("Value")
              setDoSort(true)
            }}
            className={sort == "Value" ? "bg-base-200 rounded-md" : "rounded-md"}
          >
            <a>Value (Default)</a>
          </li>
          <li
            onClick={() => {
              setSort("ValueAsc")
              setDoSort(true)
            }}
            className={sort == "ValueAsc" ? "bg-base-200 rounded-md" : "rounded-md"}
          >
            <a>Value Ascending</a>
          </li>
          <li
            onClick={() => {
              setSort("Percent")
              setDoSort(true)
            }}
            className={sort == "Percent" ? "bg-base-200 rounded-md" : "rounded-md"}
          >
            <a>Percent Gain</a>
          </li>
          <li
            onClick={() => {
              setSort("PercentAsc")
              setDoSort(true)
            }}
            className={sort == "PercentAsc" ? "bg-base-200 rounded-md" : "rounded-md"}
          >
            <a>Percent Gain Ascending</a>
          </li>
          <li
            onClick={() => {
              setSort("Gain")
              setDoSort(true)
            }}
            className={sort == "Gain" ? "bg-base-200 rounded-md" : "rounded-md"}
          >
            <a>Total Gain</a>
          </li>
          <li
            onClick={() => {
              setSort("GainAsc")
              setDoSort(true)
            }}
            className={sort == "GainAsc" ? "bg-base-200 rounded-md" : "rounded-md"}
          >
            <a>Total Gain Ascending</a>
          </li>
        </ul>
      </div>
    </>
  )
}
