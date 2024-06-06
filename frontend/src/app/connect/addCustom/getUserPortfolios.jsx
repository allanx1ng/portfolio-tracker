"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { successMsg, errorMsg } from "@/util/toastNotifications"
import { ToastContainer } from "react-toastify"
import { getPortfolios } from "@/util/getUserPortfolios"
import { useRouter } from "next/navigation"

export default function getUserPortfolios({ reload }) {
  const [portfolios, setPortfolios] = useState([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (reload) {
      fetchPortfolios()
    }
  }, [reload])
  useEffect(() => {
    fetchPortfolios()
  }, [])

  const fetchPortfolios = async () => {
    try {
      const response = await getPortfolios()

      if (response) {
        successMsg("portfolios fetched")
        console.log(response)
        setPortfolios(response)
      }
    } catch (err) {
      errorMsg(err)
    }
  }

  return (
    <div>
      {portfolios.map((p) => (
        <li key={p.uid + p.portfolio_name}>
          <a href={`/portfolios/${p.portfolio_name}`}>{p.portfolio_name}</a>
          {/* <div>{p.account_type}</div> */}
        </li>
      ))}
    </div>
  )
}
