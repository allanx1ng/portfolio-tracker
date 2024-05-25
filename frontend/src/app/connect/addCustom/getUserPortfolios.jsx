"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { successMsg, errorMsg } from "@/util/toastNotifications"
import { ToastContainer } from "react-toastify"
import apiClient from "@/util/apiClient"
import { useRouter } from "next/navigation"

export default function getPortfolios() {
  const [portfolios, setPortfolios] = useState([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchPortfolios()
  }, [])

  const fetchPortfolios = async () => {
    try {
      const response = await apiClient.get("/portfolio")

      if (response.status == 200) {
        successMsg("portfolios fetched")
        console.log(response.data.data)
        setPortfolios(response.data.data)
      }
    } catch (err) {}
  }

  return (
    <div>
      {portfolios.map((p) => (
        <div key={p.uid + p.portfolio_name}>
          <div>{p.portfolio_name}</div>
          {/* <div>{p.account_type}</div> */}
        </div>
      ))}
    </div>
  )
}
