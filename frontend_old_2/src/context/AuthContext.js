"use client"

import { useState, useEffect, createContext, useContext } from "react"
// import { decodeToken } from "@/util/authenticationUtil";

// Custom auth context
const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const login = (token) => {
    if (token) {
      localStorage.setItem("token", token)
      console.log("login processing")
      console.log(decodeToken(token))
      setUser(decodeToken(token))
    } else {
      console.log("no token")
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token != null) {
      try {
        const decodedToken = decodeToken(token)

        const didTokenExpire = Date.now() >= decodedToken.exp * 1000
        if (didTokenExpire) {
          logout()
        } else {
          setUser({ ...decodedToken, token })
        }
      } catch (err) {
        console.error("invalid token")
      }
    }
  }, [])

  return <AuthContext.Provider value={{ user, logout, login }}>{children}</AuthContext.Provider>
}

const decodeToken = (token) => {
  // Helped with https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
  try {
    return JSON.parse(atob(token.split(".")[1]))
  } catch (err) {
    console.log(err)
  }
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }
