"use client"
import Dropdown from "@/components/Dropdown"
// import { useState, useEffect } from "react"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"

const CheckUser = () => {
  const { user, logout } = useAuth()
  const [contextMenu, setContextMenu] = useState(false)

  const router = useRouter()
  if (user) {
    // console.log("Logged in with token: " + user["token"])
  }

  const handleLogout = (event) => {
    event.preventDefault()
    logout()
    router.push("/login")
    // router.push("/")
  }
  return (
    <div>
      {user ? (
        <div>
          {/* <button
            className="mx-2 font-semibold hover:underline transition duration-250 ease-in-out"
            // href="/profile"
            onClick={() => {
              setContextMenu(!contextMenu)
            }}
          >
            {user.email}
           
          </button> */}
          <Dropdown/>
          <>/</>
          {/* {contextMenu && <Dropdown/>} */}
          
          <a
            href="/login"
            className="mx-2 font-semibold hover:underline transition duration-250 ease-in-out"
            onClick={handleLogout}
          >
            Logout
          </a>
          {/* {contextMenu && <div className="w-400px h-500px bg-cyan-200">contextmenu</div>} */}
        </div>
      ) : (
        <div className="mr-8">
          <a
            href="/login"
            className="mx-2 font-semibold hover:underline transition duration-250 ease-in-out"
          >
            Login
          </a>
          <>/</>
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
