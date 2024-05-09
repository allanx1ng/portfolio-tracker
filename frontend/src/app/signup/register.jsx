"use client"
import { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/navigation"
const REGISTER_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/account`

const Register = () => {
  const [userEmail, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [passwordVerify, setPasswordVerify] = useState("")
  const [showPassword, toggleShowPassword] = useState(false)

  const errorMsg = (msg) => {
    toast.error(msg, {
      position: "bottom-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    })
  }

  const tryRegister = async () => {
		
	};

  const signUp = () => {
    if (password.length <= 3 || password.length > 20) {
      errorMsg("Password does not meet requirements")
    }
    if (password != passwordVerify) {
      errorMsg("Passwords dont match")
    }
    tryRegister();
  }
  return (
    <div className="w-screen h-screen">
      <ToastContainer />
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
