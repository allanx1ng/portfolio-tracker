"use client"

import apiClient from "@/util/apiClient"
import { useRouter } from "next/navigation"

export default function () {
    const router = useRouter()
  const googleAuth = async () => {
    const res = await apiClient.post("/oauth/google")
    console.log(res)
    router.push(res.data.url)
  }
  return (
    <div>
      <button className="px-6 py-3 bg-action-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity" onClick={() => googleAuth()}>
        google
      </button>
    </div>
  )
}
