"use client"
import Dropdown from "@/components/Dropdown"
// import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Fragment } from "react"
// import { useState } from "react"

const CheckUser = () => {
  const { user, logout } = useAuth()
  // const [contextMenu, setContextMenu] = useState(false)

  if (user) {
    // console.log("Logged in with token: " + user["token"])
  }

  return (
    <div className="">
      {user ? (
        <div>
          <Dropdown user={user} logout={logout} />
        </div>
      ) : (
        <div className="text-white">
          <a
            href="/login"
            // className="mx-2 font-semibold hover:underline transition duration-250 ease-in-out"
            className="btn btn-sm btn-secondary mx-2 text-primary"
          >
            Login
          </a>
          <>/</>
          <a
            href="/signup"
            // className="mx-2 font-semibold hover:underline transition duration-250 ease-in-out"
            className="btn btn-sm btn-secondary mx-2 text-primary"
          >
            Sign Up
          </a>
        </div>
      )}
    </div>
  )
}

export default CheckUser
