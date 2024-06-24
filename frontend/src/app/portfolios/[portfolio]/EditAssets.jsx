"use client"
import { useState, useEffect } from "react"
import { round } from "@/util/util"
import apiClient from "@/util/apiClient"
import { errorMsg, successMsg, warnMsg } from "@/util/toastNotifications"

export default function ({ data, setReload, portfolio_name, setEdit }) {
  const handleSubmit = async (e) => {
    e.preventDefault()

    const modifiedAssets = processModifyAssets()

    const processedDeleteAssets = processDeleteAssets()

    try {
      setReload(false)
      setLoading(true)
      //   console.log(modifiedAssets)
      //   console.log(processedDeleteAssets)

      const promises = []

      if (modifiedAssets.length > 0) {
        // console.log("mod")
        // console.log(portfolio_name)
        promises.push(
          apiClient.put("portfolio/assets", {
            portfolio_name: portfolio_name,
            modifiedAssets: modifiedAssets,
          })
        )
      }
      if (deleteAssets.length > 0) {
        // console.log("del")
        promises.push(
          apiClient.post("portfolio/assets/delete", {
            portfolio_name: portfolio_name,
            deleteAssets: processedDeleteAssets,
          })
        )
      }

      if (promises.length == 0) {
        warnMsg("no assets modified")
        return
      }

      const [res1, res2] = await Promise.all(promises)

      if (res1 && res2) {
        if (res1.status == 200 && res2.status == 200) {
          successMsg("Assets updated successfully")
        } else if (res1.status == 200) {
          warnMsg("Assets modified, deletion unsuccessful")
        } else if (res2.status == 200) {
          warnMsg("Assets deleted, modification unsuccessful")
        } else {
          return
        }
      } else if (res1) {
        if (res1.status == 200) {
          successMsg("Assets updated successfully")
        }
      } else if (res2) {
        if (res2.status == 200) {
          successMsg("Assets deleted successfully")
        }
      }

      setEdit(false)
      setReload(true)
    } catch (error) {
      errorMsg(error.message)

      //   console.error("Error submitting data:", error)
    } finally {
      setLoading(false)
      setReload(true)
    }
  }

  const [loading, setLoading] = useState(false)
  const [deleteAssets, setDeleteAssets] = useState([])
  const [currentData, setCurrentData] = useState({})
  const [initialData, setInitialData] = useState({})

  useEffect(() => {
    const formattedData = data.reduce((acc, asset) => {
      const key = `${asset.asset_ticker}-${asset.asset_name}`
      acc[key] = {
        asset_name: asset.asset_name,
        total_amount: round(asset.total_amount, 2) || 0,
        combined_avg_price: round(asset.combined_avg_price, 2) || 0,
      }
      return acc
    }, {})
    setInitialData(formattedData)
    setCurrentData(formattedData)
  }, [data])

  const handleModify = (key, field, value) => {
    // if (isNaN(value)) {
    //   value = 0 // Set a default value if the input is not a valid number
    // }
    setCurrentData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }))
  }

  const handleDelete = (key) => {
    setDeleteAssets((prev) => {
      if (!prev.includes(key)) {
        return [...prev, key]
      }
      return prev.filter((item) => item !== key)
    })
  }

  const processDeleteAssets = () => {
    return deleteAssets.map((key) => {
      const [asset_ticker, asset_name] = key.split("-")
      return { asset_ticker, asset_name }
    })
  }

  const processModifyAssets = () => {
    return Object.keys(currentData).reduce((acc, key) => {
      if (
        (currentData[key].total_amount !== initialData[key].total_amount ||
          currentData[key].combined_avg_price !== initialData[key].combined_avg_price) &&
        !deleteAssets.includes(key)
      ) {
        const [asset_ticker, asset_name] = key.split("-")
        acc.push({
          asset_ticker,
          asset_name,
          total_amount: currentData[key].total_amount,
          combined_avg_price: currentData[key].combined_avg_price,
        })
      }
      return acc
    }, [])
  }
  return (
    <div className="flex justify-between items-center transition-opacity duration-300 ease-in-out">
        {/* <ToastContainer/> */}
      <div className="min-w-screen bg-base-200 shadow-md rounded my-6 pt-3">
        <div className="grid grid-cols-5 font-light uppercase text-sm leading-normal h-10">
          <div className="py-3 px-6 text-center">Delete?</div>
          <div className="py-3 px-6 text-center">name</div>
          <div className="py-3 px-6 text-center">amount</div>
          <div className="py-3 px-6 text-center">avg price</div>
        </div>
        <div className="py-3">
          {Object.keys(currentData).map((key) => (
            <form
              key={key}
              className="grid grid-cols-5 text-sm font-light items-center text-center"
            >
              <div className="h-10 flex items-center justify-center py-3 px-6">
                <input
                  type="checkbox"
                  className=" text-red-500 checkbox"
                  checked={deleteAssets.includes(key)}
                  onChange={() => handleDelete(key)}
                />
              </div>
              <div className="py-3 px-6 h-10 flex items-center justify-center">
                {currentData[key].asset_name}
              </div>
              <div className="py-3 px-6 h-10">
                <input
                  disabled={deleteAssets.includes(key)}
                  type="number"
                  value={currentData[key].total_amount}
                  onChange={(e) => handleModify(key, "total_amount", parseFloat(e.target.value))}
                  className="input input-bordered max-w-xs appearance-none w-11/12 h-6"
                />
              </div>
              <div className="py-3 px-6 h-10">
                <input
                  disabled={deleteAssets.includes(key)}
                  type="number"
                  value={currentData[key].combined_avg_price}
                  onChange={(e) =>
                    handleModify(key, "combined_avg_price", parseFloat(e.target.value))
                  }
                  className="input input-bordered max-w-xs appearance-none w-11/12 h-6"
                />
              </div>
            </form>
          ))}
        </div>

        {/* {data.map((asset) => (
        <form
          key={asset.asset_ticker}
          className="grid grid-cols-5 text-gray-600 text-sm font-light"
        >
          <button
            type="button"
            className="rounded-full border-2 border-red-500 w-4 h-4"
            onClick={() => handleDelete(asset.asset_ticker, asset.asset_name)}
          >
            -
          </button>
          <div>{asset.asset_name}</div>
          <div>{asset.asset_ticker}</div>
          <div>
            <span>Amt:</span>
            <input
              type="number"
              value={
                currentData[asset.asset_ticker]
                  ? round(currentData[asset.asset_ticker].total_amount, 2)
                  : 0
              }
              onChange={(e) => handleModify(asset.asset_ticker, "total_amount", e.target.value)}
              className="border p-1"
            />
          </div>
          <div>
            <span>avg price:</span>
            <input
              type="number"
              value={
                currentData[asset.asset_ticker]
                  ? round(currentData[asset.asset_ticker].combined_avg_price, 2)
                  : 0
              }
              onChange={(e) =>
                handleModify(asset.asset_ticker, "combined_avg_price", e.target.value)
              }
              className="border p-1"
            />
          </div>
        </form>
      ))} */}
      </div>
      <button disabled={loading} onClick={(e) => handleSubmit(e)} className="btn btn-accent mx-6">
        Submit
      </button>
    </div>
  )
}
