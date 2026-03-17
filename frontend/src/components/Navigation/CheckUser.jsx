"use client"
import Dropdown from "@/components/Dropdown"
// import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
// import { useState } from "react"

const CheckUser = () => {
  const { user, authLoading, logout } = useAuth()
  // const [contextMenu, setContextMenu] = useState(false)

  if (user) {
    // console.log("Logged in with token: " + user["token"])
  }

  return (
    <div className="">
      {authLoading ? (
        <div className="h-9" />
      ) : user ? (
        <div>
          <Dropdown user={user} logout={logout} />
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors duration-150"
          >
            Login
          </a>
          <a
            href="/signup"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-action-primary hover:bg-action-primary/90 transition-colors duration-150"
          >
            Sign Up
          </a>
        </div>
      )}
    </div>
  )
}

export default CheckUser
