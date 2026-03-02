"use client"

import { useAuth } from "@/context/AuthContext"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { PageSpinner } from "@/components/ui/Spinner"

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

  if (authLoading || (!user && !isPublic)) {
    return <PageSpinner />
  }

  return children
}
