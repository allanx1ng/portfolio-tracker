"use client"
import apiClient from "@/util/apiClient"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { round } from "@/util/util"

export default function ({ asset_name, asset_ticker }) {
  const { user } = useAuth()
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    if (user) {
      fetchUserAssets()
    }
  }, [user])

  if (!user) {
    return <></>
  }

  const fetchUserAssets = async () => {
    try {
      // console.log("trying req")
      const res = await apiClient.get("/single-asset", {
        params: {
          asset_name: asset_name,
          asset_ticker: asset_ticker,
        },
      })
      if (res.status == 200) {
        if (res.data.data) {
          setAmount(res.data.data)
        } else {
          setAmount(0)
        }
      }
    } catch (err) {
      console.log("error404")
    }
  }

  return (
    <div>
      <h1>
        {round(amount, 2)} {asset_ticker}
      </h1>
    </div>
  )
}
