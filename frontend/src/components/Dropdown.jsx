"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/buttons"

const Dropdown = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef()
  const router = useRouter()

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

  const handleLogout = (event) => {
    event.preventDefault()
    logout()
    router.push("/login")
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <span>Hello, {user.email}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-card ring-1 ring-border focus:outline-none">
          <a
            href="/profile"
            className="block px-4 py-2 text-text-primary hover:bg-bg-alt"
          >
            Profile
          </a>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-action-danger hover:bg-bg-alt"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default Dropdown
