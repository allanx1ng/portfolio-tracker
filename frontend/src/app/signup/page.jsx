"use client"
import { useState } from "react"
const Signup = () => {
  const [userEmail, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, toggleShowPassword] = useState(false)
  return (
    <div className="w-screen h-screen">
      <form className="grid w-full justify-center p-10 space-y-2">
        <input
          className="h-8 rounded-lg px-2 border-teal-800 border-2"
          placeholder={"Email"}
          value={userEmail}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          className="h-8 rounded-lg px-2 border-teal-800 border-2"
          placeholder={"Username"}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <div className="relative">
          <input
            className="w-full h-8 rounded-lg px-2 border-teal-900 border-2"
            placeholder={"Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
          />
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm hover:cursor-pointer" onClick={(e) => toggleShowPassword(!showPassword)}>
           {showPassword ? 'hide' : 'show'}
          </span>
        </div>

        <input
          className="h-8 rounded-lg px-2 border-teal-900 border-2"
          placeholder={"Re-enter Password"}
          type="password"
        />
      </form>
      <div>{userName} user</div>
      <p>{password} pass</p>
    </div>
  )
}

export default Signup
