"use client"
import { useState, useRef, useEffect } from "react"
import ToggleDarkmode from "./ToggleDarkmode"
// import { ChevronDownIcon } from '@heroicons/react/solid'; // Make sure you have Heroicons installed
import { useRouter } from "next/navigation"

const Dropdown = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  const router = useRouter()

  const handleLogout = (event) => {
    event.preventDefault()
    logout()
    router.push("/login")
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-sm btn-secondary m-1 text-primary">
        Hello, {user.email}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <li>
          <a href="/profile">Profile</a>
        </li>
        {/* <li>
          <ToggleDarkmode/>
        </li> */}

        <li>
          <a
            href="/login"
            className="btn btn-sm btn-error mx-2 btn-outline my-2"
            onClick={handleLogout}
          >
            Logout
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Dropdown
