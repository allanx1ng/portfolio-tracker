"use client"
import { useState } from "react"
import AssetSearch from "./AssetSearch"
import apiClient from "@/util/apiClient"
import { errorMsg, successMsg } from "@/util/toastNotifications"
import { ToastContainer } from "react-toastify"

export default function ({ name, setReload }) {
  const [asset, setAsset] = useState(null)
  const [price, setPrice] = useState(0)
  const [amount, setAmount] = useState(0)
  const [visible, setVisible] = useState(false)

  const [loading, setLoading] = useState(false)

  const toggleVisiblity = () => {
    setVisible(!visible)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!asset) {
      errorMsg("Please select an asset")
      return
    } else if (!price || !amount) {
      errorMsg("please fill out all fields")
      return
    }
    try {
      setLoading(true)
      setReload(false)
      const response = await apiClient.post("/portfolio/add-asset", {
        portfolio: name,
        asset: {
          type: asset.type,
          name: asset.name,
          ticker: asset.ticker,
          amount: amount,
          price: price,
        },
      })
      if (response.status == 201) {
        setReload(true)
        successMsg('success')
      } else {
        errorMsg('err')
      }
    } catch (err) {
      errorMsg(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
        {/* <ToastContainer/> */}

      add assets:
      <button onClick={toggleVisiblity}>Add Asset</button>
      <div className={visible ? "block" : "hidden"}>
        <form>
          <AssetSearch setAsset={setAsset} />
          Asset
          {/* <input className="h-8 rounded-lg px-2 border-teal-800 border-2" placeholder={"BTC"} />
           */}
          {asset ? (
            <div>
              Asset selected:
              {asset.name}
              {asset.ticker}
              {asset.type}
            </div>
          ) : (
            <div>select an asset</div>
          )}
          Avg buy price
          <input
            className="h-8 rounded-lg px-2 border-teal-800 border-2"
            placeholder={"50000.00"}
            type="number"
            onChange={(e) => {
              setPrice(e.target.value)
            }}
          />
          Amt
          <input
            className="h-8 rounded-lg px-2 border-teal-800 border-2"
            placeholder={"0.1"}
            onChange={(e) => {
              setAmount(e.target.value)
            }}
          />
        </form>
        <button onClick={(e) => handleSubmit(e)} disabled={loading}>Add asset</button>
      </div>
    </div>
  )
}
