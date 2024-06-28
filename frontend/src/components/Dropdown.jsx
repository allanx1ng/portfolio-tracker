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
    // router.push("/")
  }

  return (
    // <div className="relative inline-block text-left" ref={dropdownRef}>
    //   <button
    //     onClick={() => setIsOpen(!isOpen)}
    //     // className="mx-2 font-semibold hover:underline transition duration-250 ease-in-out"
    //     className="btn btn-sm btn-primary mx-2"
    //   >
    //     {user.email}
    //     {/* <ChevronDownIcon className="w-5 h-5 ml-2" /> */}
    //   </button>
    //   {isOpen && (
    //     <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
    //       <div className="px-4 py-3 bg-white rounded-md shadow-lg">
    //         <div className="relative">
    //           <div className="absolute right-0 -top-2 w-3 h-3 bg-white border-gray-200 border-b border-r transform rotate-45" />
    //         </div>
    //         <div className="flex flex-col">
    //           {/* <ToggleDarkmode/> */}
    //           <a href="#" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
    //             Profile
    //           </a>
    //           <a href="#" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
    //             Settings
    //           </a>
    //           <a href="#" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
    //             Preferences
    //           </a>
    //           <a href="#" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
    //             Logout
    //           </a>
    //           <label className="swap swap-rotate">
    //             {/* this hidden checkbox controls the state */}
    //             <input type="checkbox" className="theme-controller" value="light" />

    //             {/* sun icon */}
    //             <svg
    //               className="swap-off fill-current w-10 h-10"
    //               xmlns="http://www.w3.org/2000/svg"
    //               viewBox="0 0 24 24"
    //             >
    //               <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
    //             </svg>

    //             {/* moon icon */}
    //             <svg
    //               className="swap-on fill-current w-10 h-10"
    //               xmlns="http://www.w3.org/2000/svg"
    //               viewBox="0 0 24 24"
    //             >
    //               <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
    //             </svg>
    //           </label>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-sm btn-secondary m-1">
        Hello, {user.email}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <li>
          <a>Item 1</a>
        </li>
        <li>
          <a>Item 2</a>
        </li>
        <li>
          <ToggleDarkmode/>
        </li>

        <li>
          <a
            href="/login"
            // className="mx-2 font-semibold hover:underline transition duration-250 ease-in-out"
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
