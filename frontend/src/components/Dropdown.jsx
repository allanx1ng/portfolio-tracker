"use client"
import { useState, useRef, useEffect } from "react"
import ToggleDarkmode from "./ToggleDarkmode"
// import { ChevronDownIcon } from '@heroicons/react/solid'; // Make sure you have Heroicons installed

const Dropdown = () => {
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

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mx-2 font-semibold hover:underline transition duration-250 ease-in-out"
      >
        test
        {/* <ChevronDownIcon className="w-5 h-5 ml-2" /> */}
      </button>
      {isOpen && (
        <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
          <div className="px-4 py-3 bg-white rounded-md shadow-lg">
            <div className="relative">
              <div className="absolute right-0 -top-2 w-3 h-3 bg-white border-gray-200 border-b border-r transform rotate-45" />
            </div>
            <div className="flex flex-col">
              {/* <ToggleDarkmode/> */}
              <a href="#" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </a>
              <a href="#" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Settings
              </a>
              <a href="#" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Preferences
              </a>
              <a href="#" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Logout
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
