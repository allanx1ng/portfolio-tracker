"use client"
import { useState, useEffect } from "react"

export default function () {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme) {
      setTheme(storedTheme)
      document.documentElement.classList.add(storedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.remove(theme)
    document.documentElement.classList.add(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return (
    <div className="flex items-center">
      <span className={`w-6 h-6 ${theme === "light" ? "text-yellow-500" : "text-gray-400"}`}>
        light
      </span>
      <button
        onClick={toggleTheme}
        className="relative inline-flex items-center h-6 rounded-full w-11 mx-2"
      >
        <span className="sr-only">Toggle Theme</span>
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
            theme === "dark" ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className={`w-6 h-6 ${theme === "dark" ? "text-blue-500" : "text-gray-400"}`}>
        dark
      </span>
    </div>
  )
}
