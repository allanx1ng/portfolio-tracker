"use client"
import { useState } from "react"
import AssetSearch from "./AssetSearch"

export default function () {
  const [asset, setAsset] = useState("")
  const [price, setPrice] = useState(0)
  const [amount, setAmount] = useState(0)
  const [visible, setVisible] = useState(false)

  const [loading, setLoading] = useState(false)

  const toggleVisiblity = () => {
    setVisible(!visible)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div>
      add assets:
      <button onClick={toggleVisiblity}>Add Asset</button>
      <div className={visible ? "block" : "hidden"}>
        <form>
            <AssetSearch/>
          Asset
          <input className="h-8 rounded-lg px-2 border-teal-800 border-2" placeholder={"BTC"} />
          Avg buy price

          <input
            className="h-8 rounded-lg px-2 border-teal-800 border-2"
            placeholder={"50000.00"}
            type="number"
          />
          Amt
          <input className="h-8 rounded-lg px-2 border-teal-800 border-2" placeholder={"0.1"} />
        </form>
        <button onClick={(e) => handleSubmit(e)}>Add asset</button>
      </div>
    </div>
  )
}
