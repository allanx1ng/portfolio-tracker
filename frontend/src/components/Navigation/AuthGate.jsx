"use client"

import { useAuth } from "@/context/AuthContext"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/auth"]

export default function AuthGate({ children }) {
  const { user, authLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isPublic = PUBLIC_ROUTES.some(
    route => pathname === route || pathname.startsWith(route + "/")
  )

  useEffect(() => {
    if (!authLoading && !user && !isPublic) {
      router.push("/login")
    }
  }, [authLoading, user, isPublic])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-action-primary"></span>
      </div>
    )
  }

  if (!user && !isPublic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-action-primary"></span>
      </div>
    )
  }

  return children
}
