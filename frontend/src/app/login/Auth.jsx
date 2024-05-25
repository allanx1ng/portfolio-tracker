"use client"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/util/apiClient";
import { successMsg, errorMsg } from "@/util/toastNotifications";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const LOGIN_URL = `${BACKEND_URL}/login`;
const Auth = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const router = useRouter();
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
      const response = await apiClient.post(LOGIN_URL, { email, password });

      if (response.status === 201) {
        successMsg("Login Successful");
        login(response.data.token);
        setJustLoggedIn(true)
        setTimeout(() => {
          setIsLoading(false);
          router.push("/");
        }, 2000);
      } else {
        errorMsg(response.status);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        errorMsg(`Error: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        // Request was made but no response was received
        errorMsg("Network error, please try again later.");
      } else {
        // Something else happened in setting up the request
        errorMsg(`Error: ${error.message}`);
      }
    } finally {
    }
  }
  return (
    <div className="w-screen h-screen">
      <ToastContainer />
      <form className="grid w-full justify-center p-10 space-y-2" >
        <input
          className="h-8 rounded-lg px-2 border-teal-800 border-2"
          placeholder={"Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="h-8 rounded-lg px-2 border-teal-900 border-2"
          placeholder={"Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        <button disabled={isLoading}
          className="border-2 text-white font-medium bg-green-400 border-green-400 rounded-lg h-8 w-full place-self-center hover:border-green-500"
          onClick={handleLogin}
        >
          Login
        </button>
      </form>
      {isLoading && <div>loading</div>}
      <div>{email} email</div>
      <p>{password} pass</p>
    </div>
  )
}

export default Auth
