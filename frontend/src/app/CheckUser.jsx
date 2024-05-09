"use client"
import { useState } from "react"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

const CheckUser = () => {
  const { user, logout } = useAuth()
  const router = useRouter()
  if (user) {
    console.log("Logged in with token: " + user["token"])
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }
  return (
   
      <div>
        {user ? (
          <a className="mr-8 font-semibold hover:underline transition duration-250 ease-in-out" href="/profile">
            {user.username}
          </a>
        ) : (
          <div className="mr-8">
            <a
              href="/login"
              className="mx-2 font-semibold hover:underline transition duration-250 ease-in-out"
            >
              Login
            </a>
            <text>/</text>
            <a
              href="/signup"
              className="mx-2 font-semibold hover:underline transition duration-250 ease-in-out"
            >
              Sign Up
            </a>
          </div>
        )}
      </div>
  )
}

export default CheckUser
