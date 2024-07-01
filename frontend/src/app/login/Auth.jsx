"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import apiClient from "@/util/apiClient"
import { successMsg, errorMsg } from "@/util/toastNotifications"
import Loading from "@/components/loading"
const NODE_ENV = process.env.NODE_ENV
const BACKEND_URL =
  NODE_ENV == "development"
    ? process.env.NEXT_PUBLIC_BACKEND_URL_DEV
    : process.env.NEXT_PUBLIC_BACKEND_URL
const LOGIN_URL = `${BACKEND_URL}/login`
const Auth = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [justLoggedIn, setJustLoggedIn] = useState(false)
  const router = useRouter()
  const { login, user } = useAuth()

  useEffect(() => {
    if (user && !justLoggedIn) {
      router.push("/")
    }
  }, [user, justLoggedIn])

  const handleLogin = async (event) => {
    event.preventDefault()
    if (!email || !password) {
      errorMsg("plz fill in boxes")
      return
    }
    setIsLoading(true)
    try {
      const response = await apiClient.post(LOGIN_URL, { email, password })

      if (response.status === 201) {
        successMsg("Login Successful")
        login(response.data.token)
        setJustLoggedIn(true)
        setTimeout(() => {
          setIsLoading(false)
          router.push("/")
        }, 500)
      } else {
        errorMsg(response.status)
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        errorMsg(`Error: ${error.response.status} - ${error.response.data.message}`)
      } else if (error.request) {
        // Request was made but no response was received
        errorMsg("Network error, please try again later.")
      } else {
        // Something else happened in setting up the request
        errorMsg(`Error: ${error.message}`)
      }
      setIsLoading(false)
    } finally {
    }
  }
  return (
    <div className="w-screen h-screen">
      <form className="grid w-full justify-center p-10 space-y-2">
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
            value={email}
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
            type={"password"}
            required
          />
        </label>
        <button disabled={isLoading} className="btn btn-accent btn-outline" onClick={handleLogin}>
          {!isLoading && "Login"}
          {isLoading && <Loading />}
        </button>
      </form>
      {/* {isLoading && <div>loading</div>} */}
      {/* <div>{email} email</div>
      <p>{password} pass</p> */}
    </div>
  )
}

export default Auth
