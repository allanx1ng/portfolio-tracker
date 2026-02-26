"use client"

import { useState, useEffect, createContext, useContext } from "react"
import apiClient from "@/util/apiClient"

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken")

    // Tell backend to invalidate the refresh token
    try {
      await apiClient.post("/logout", { refreshToken })
    } catch (err) {
      // Logout should succeed even if backend call fails
    }

    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    setUser(null)
  }

  const login = (token, refreshToken) => {
    if (token) {
      localStorage.setItem("token", token)
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken)
      }
      setUser(decodeToken(token))
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token != null) {
      try {
        const decodedToken = decodeToken(token)

        const didTokenExpire = Date.now() >= decodedToken.exp * 1000
        if (didTokenExpire) {
          // Don't logout — the apiClient interceptor will handle refresh
          // Just don't set user; AuthGate will show loading, and the next
          // API call will trigger a refresh which updates localStorage
          const refreshToken = localStorage.getItem("refreshToken")
          if (refreshToken) {
            // Attempt refresh immediately
            apiClient.post("/refresh", { refreshToken })
              .then(({ data }) => {
                localStorage.setItem("token", data.token)
                localStorage.setItem("refreshToken", data.refreshToken)
                setUser(decodeToken(data.token))
              })
              .catch(() => {
                localStorage.removeItem("token")
                localStorage.removeItem("refreshToken")
              })
              .finally(() => setAuthLoading(false))
            return // don't setAuthLoading(false) yet
          } else {
            localStorage.removeItem("token")
          }
        } else {
          setUser({ ...decodedToken, token })
        }
      } catch (err) {
        console.error("invalid token")
      }
    }
    setAuthLoading(false)
  }, [])

  return <AuthContext.Provider value={{ user, authLoading, logout, login }}>{children}</AuthContext.Provider>
}

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]))
  } catch (err) {
    console.log(err)
  }
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }
