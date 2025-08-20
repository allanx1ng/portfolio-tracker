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
      <button className="btn btn-primary" onClick={() => googleAuth()}>
        google
      </button>
    </div>
  )
}
