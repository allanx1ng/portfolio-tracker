"use client"
import apiClient from "@/util/apiClient"

import { useState } from "react"
import { successMsg, errorMsg } from "@/util/toastNotifications"
import { ToastContainer } from "react-toastify"

export default function addPortfolio({ setReload }) {
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
      <ToastContainer />
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New Portfolio" />
      <button onClick={(e) => handleSubmit(e)}>save</button>
    </form>
  )
}
