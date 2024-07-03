"use client"

// ThemeContext.js
import { createContext, useContext, useState, useEffect } from "react"

const DEFAULT_LIGHT = "green"
const DEFAULT_DARK = "dark"

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme")
      return savedTheme ? savedTheme : DEFAULT_LIGHT
    }
    return DEFAULT_LIGHT // Default theme when localStorage is not available
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme)
      document.documentElement.setAttribute("data-theme", theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === DEFAULT_LIGHT ? DEFAULT_DARK : DEFAULT_LIGHT))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
