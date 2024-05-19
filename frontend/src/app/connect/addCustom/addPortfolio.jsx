"use client"
import apiClient from "@/util/apiClient"

import { useState } from "react"
import { successMsg, errorMsg } from "@/util/toastNotifications"
import { ToastContainer } from "react-toastify"

export default function addPortfolio() {
  const [name, setName] = useState("")
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        const url = "/portfolio/create/" + name
      const response = await apiClient.post(url)
      if (response.status == 200) {
        successMsg("success")
      }
    } catch (err) {
        console.log(err)
        errorMsg(err.message + err.response.data.error.detail)
    }
  }
  return (
    <form>
        <ToastContainer/>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New Portfolio" />
      <button onClick={(e) => handleSubmit(e)}>save</button>
    </form>
  )
}
