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
        }, 500)
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
      <ToastContainer className="z-50" />
      {/* {justRegistered && 
        <VerifyEmail/>
      } */}
      <form className="grid w-full justify-center center p-10 space-y-2">
        <label className="input input-bordered input-primary flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            className="grow"
            placeholder={"Email"}
            value={userEmail}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>

        <label className="input input-bordered input-primary flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            className="grow"
            placeholder={"Username"}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </label>

        <label className="input input-bordered input-primary flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            className="grow"
            placeholder={"Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            required
          />

          <label className="swap swap-rotate">
            <input
              type="checkbox"
              onChange={() => {
                toggleShowPassword(!showPassword)
              }}
              checked={!showPassword}
            />
            <svg
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              className="swap-off fill-current w-10 h-10"
            >
              <path d="M0 0h48v48h-48z" fill="none" />
              <path d="M24 9c-10 0-18.54 6.22-22 15 3.46 8.78 12 15 22 15 10.01 0 18.54-6.22 22-15-3.46-8.78-11.99-15-22-15zm0 25c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10zm0-16c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
            </svg>
            <svg
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              className="swap-on fill-current w-10 h-10"
            >
              <path d="M0 0h48v48h-48zm0 0h48v48h-48zm0 0h48v48h-48zm0 0h48v48h-48z" fill="none" />
              <path d="M24 14c5.52 0 10 4.48 10 10 0 1.29-.26 2.52-.71 3.65l5.85 5.85c3.02-2.52 5.4-5.78 6.87-9.5-3.47-8.78-12-15-22.01-15-2.8 0-5.48.5-7.97 1.4l4.32 4.31c1.13-.44 2.36-.71 3.65-.71zm-20-5.45l4.56 4.56.91.91c-3.3 2.58-5.91 6.01-7.47 9.98 3.46 8.78 12 15 22 15 3.1 0 6.06-.6 8.77-1.69l.85.85 5.83 5.84 2.55-2.54-35.45-35.46-2.55 2.55zm11.06 11.05l3.09 3.09c-.09.43-.15.86-.15 1.31 0 3.31 2.69 6 6 6 .45 0 .88-.06 1.3-.15l3.09 3.09c-1.33.66-2.81 1.06-4.39 1.06-5.52 0-10-4.48-10-10 0-1.58.4-3.06 1.06-4.4zm8.61-1.57l6.3 6.3.03-.33c0-3.31-2.69-6-6-6l-.33.03z" />
            </svg>
          </label>

          {/* <span
            className="inset-y-0 right-0 pr-2 flex items-center text-sm hover:cursor-pointer w-6"
            onClick={(e) => toggleShowPassword(!showPassword)}
          >
            {showPassword ? "hide" : "show"}
          </span> */}
        </label>

        <label className="input input-bordered input-primary flex items-center gap-2">
          {" "}
          <input
            className="grow"
            placeholder={"Re-enter Password"}
            value={passwordVerify}
            onChange={(e) => setPasswordVerify(e.target.value)}
            type={showPassword ? "text" : "password"}
            required
          />
        </label>

        <button className="btn btn-success btn-outline" onClick={signUp} disabled={isLoading}>
          Sign Up
        </button>
      </form>
      {/* <div>Sign in with google (to be implemented)</div>
      <div>{userName} user</div>
      <p>{password} pass</p> */}
    </div>
  )
}

export default Register
