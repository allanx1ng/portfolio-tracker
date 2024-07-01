"use client"
import Dropdown from "@/components/Dropdown"
// import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
// import { useState } from "react"

const CheckUser = () => {
  const { user, logout } = useAuth()
  // const [contextMenu, setContextMenu] = useState(false)

  if (user) {
    // console.log("Logged in with token: " + user["token"])
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
          <Dropdown user={user} logout={logout} />
          {/* <>/</> */}
          {/* {contextMenu && <Dropdown/>} */}

          {/* <a
            href="/login"
            // className="mx-2 font-semibold hover:underline transition duration-250 ease-in-out"
            className="btn btn-sm btn-primary mx-2"
            onClick={handleLogout}
          >
            Logout
          </a> */}
          {/* {contextMenu && <div className="w-400px h-500px bg-cyan-200">contextmenu</div>} */}
        </div>
      ) : (
        <div className="">
          <a
            href="/login"
            // className="mx-2 font-semibold hover:underline transition duration-250 ease-in-out"
            className="btn btn-sm btn-secondary mx-2"
          >
            Login
          </a>
          <>/</>
          <a
            href="/signup"
            // className="mx-2 font-semibold hover:underline transition duration-250 ease-in-out"
            className="btn btn-sm btn-secondary mx-2"
          >
            Sign Up
          </a>
        </div>
      )}
    </div>
  )
}

export default CheckUser
