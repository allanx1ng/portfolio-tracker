"use client"
import apiClient from "@/util/apiClient"
import { useAuth } from "@/context/AuthContext"
import { errorMsg } from "@/util/toastNotifications"
import { useRouter } from "next/navigation"

export default function ({ price }) {
  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = async () => {
    try {
      const res = await apiClient.post("/donation", {
        items: [price],
      })
      // console.log(res)
      if (res.status == 200) {
        // successMsg("Success")
        // console.log(res.data)
        const url = res.data.url
        router.push(url)
      }
    } catch (err) {
      errorMsg("Error")
    }
  }

  return (
    <button className="btn btn-accent btn-outline w-40" onClick={handleSubmit}>
      <p>${price}</p>
    </button>
  )
}
