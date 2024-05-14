"use client"
import { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import { successMsg, errorMsg } from "@/util/toastNotifications"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import apiClient from "@/util/apiClient"
import VerifyEmail from "@/components/VerifyEmail"

const Register = () => {
  const [userEmail, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [passwordVerify, setPasswordVerify] = useState("")
  const [showPassword, toggleShowPassword] = useState(false)
  const [justRegistered, setJustRegistered] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const { login, user } = useAuth()

  const router = useRouter()

  useEffect(() => {
    if (user && !justRegistered) {
      router.push("/")
    }
  }, [user, justRegistered])

  const tryRegister = async (event) => {
    setIsLoading(true)

    try {
      const response = await apiClient.post("/register", {
        email: userEmail,
        username: userName,
        password: password,
      })

      if (response.status === 201) {
        successMsg("Registration Successful")
        setJustRegistered(true)
        setTimeout(() => {
          setIsLoading(false)
          router.push("/")
        }, 2000)
      } else {
        errorMsg(response.status)
      }
    } catch (error) {
      setIsLoading(false)
      if (error.response) {
        // Server responded with a status other than 2xx
        errorMsg(`Error ${error.response.status} - ${error.response.data.message}`)
      } else if (error.request) {
        // Request was made but no response was received
        errorMsg("Network error, please try again later.")
      } else {
        // Something else happened in setting up the request
        errorMsg(`Error: ${error.message}`)
      }
    } finally {
    }
  }

  const signUp = (event) => {
    event.preventDefault()
    if (!userEmail) {
      errorMsg("plz enter email")
      return
    }
    if (!userName) {
      errorMsg("plz enter username")
      return
    }
    if (password.length < 3 || password.length > 20) {
      errorMsg("Password does not meet requirements")
      return
    }
    if (password != passwordVerify) {
      errorMsg("Passwords dont match")
      return
    }
    tryRegister()
  }
  return (
    <div className="w-screen h-screen">
      <ToastContainer className='z-50' />
      {/* {justRegistered && 
        <VerifyEmail/>
      } */}
      <form className="grid w-full justify-center center p-10 space-y-2">
        <input
          className="h-8 rounded-lg px-2 border-teal-800 border-2"
          placeholder={"Email"}
          value={userEmail}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="h-8 rounded-lg px-2 border-teal-800 border-2"
          placeholder={"Username"}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <div className="relative">
          <input
            className="w-full h-8 rounded-lg px-2 border-teal-900 border-2"
            placeholder={"Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            required
          />
          <span
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm hover:cursor-pointer"
            onClick={(e) => toggleShowPassword(!showPassword)}
          >
            {showPassword ? "hide" : "show"}
          </span>
        </div>

        <input
          className="h-8 rounded-lg px-2 border-teal-900 border-2"
          placeholder={"Re-enter Password"}
          value={passwordVerify}
          onChange={(e) => setPasswordVerify(e.target.value)}
          type="password"
          required
        />
        <button
          className="border-2 text-white font-medium bg-green-400 border-green-400 rounded-lg h-8 w-full place-self-center hover:border-green-500"
          onClick={signUp}
          disabled={isLoading}
        >
          Sign Up
        </button>
      </form>
      <div>Sign in with google (to be implemented)</div>
      <div>{userName} user</div>
      <p>{password} pass</p>
    </div>
  )
}

export default Register
