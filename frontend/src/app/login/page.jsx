"use client"
import { useState } from "react"
const Login = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  return (
    <div className="w-screen h-screen">
      <form className="grid w-full justify-center p-10 space-y-2">
        <input className="h-8 rounded-lg px-2 border-teal-800 border-2" placeholder={"Username"} value={userName} onChange={(e) => setUserName(e.target.value)} />
        <input className="h-8 rounded-lg px-2 border-teal-900 border-2" placeholder={"Password"} value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
      </form>
      <div>{userName} user</div>
      <p>{password} pass</p>
    </div>
  )
}

export default Login
