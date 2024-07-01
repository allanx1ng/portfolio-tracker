"use client"
import { useState } from "react"
import AssetSearch from "./AssetSearch"
import apiClient from "@/util/apiClient"
import { errorMsg, successMsg } from "@/util/toastNotifications"
import { ToastContainer } from "react-toastify"

export default function ({ name, setReload, visible }) {
  const [asset, setAsset] = useState(null)
  const [price, setPrice] = useState(0)
  const [amount, setAmount] = useState(0)

  const [loading, setLoading] = useState(false)

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
          id: asset.id,
          amount: amount,
          price: price,
        },
      })
      if (response.status == 201) {
        setReload(true)
        successMsg("success")
      } else {
        errorMsg("err")
      }
    } catch (err) {
      errorMsg(err.message)
    } finally {
      setReload(true)
      setLoading(false)
    }
  }

  return (
    <dialog id="my_modal_2" className="modal">
      {/* <ToastContainer/> */}
      <div className="modal-box">
        <form className="gap-2 mb-4">
          <h2 className="my-2">Search for an asset:</h2>
          <AssetSearch setAsset={setAsset} />
          <div className="flex items-center mt-4">
            <p>Asset: </p>
            {asset ? (
              <kbd className="kbd">{asset.name + " (" + asset.ticker + ")"}</kbd>
            ) : (
              <div>No asset selected</div>
            )}
          </div>

          <div className="bg-base-200 rounded-lg p-4 my-4">
            <div className="grid grid-cols-2 gap-4 mb-2 text-center">
              <div>Amount</div>
              <div>Buy price</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 ">
              <input
                className="input input-primary"
                placeholder={"0.1"}
                onChange={(e) => {
                  setAmount(e.target.value)
                }}
              />
              <input
                className="input input-primary"
                placeholder={"50000.00"}
                type="number"
                onChange={(e) => {
                  setPrice(e.target.value)
                }}
              />
            </div>
          </div>
        </form>
        <div className="flex w-full justify-between">
          <button
            onClick={(e) => handleSubmit(e)}
            disabled={loading}
            className="btn btn-accent"
          >
            Add asset
          </button>
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-outline btn-error">Close</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
