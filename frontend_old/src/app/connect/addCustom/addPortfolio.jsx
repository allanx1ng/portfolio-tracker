"use client"
import apiClient from "@/util/apiClient"

import { useState } from "react"
import { successMsg, errorMsg } from "@/util/toastNotifications"
import { usePortfolios } from "@/context/PortfoliosContext"

export default function addPortfolio() {
  const {setReload} = usePortfolios()
  const [name, setName] = useState("")
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setReload(false)
      const url = "/portfolio/create/" + name
      const response = await apiClient.post(url)
      if (response.status == 200) {
        successMsg("success")
        setReload(true)
      }
    } catch (err) {
      console.log(err)
      try {
        if (err.response.status == 401) {
          errorMsg("not logged in 401")
        } else if (err.response.status == 403) {
          errorMsg("unauthorized 403")
        } else {
          errorMsg(err.message + err.response.data.error.detail)
        }
      } catch (err) {
        errorMsg(err.message)
      }
    }
  }
  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New Portfolio" className="input input-bordered input-primary w-full max-w-xs mx-4"/>
      <button onClick={(e) => handleSubmit(e)} className="btn btn-outline btn-error">save</button>
    </form>
  )
}
