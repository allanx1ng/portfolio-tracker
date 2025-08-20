'use client'

import ErrorCode from "@/components/ErrorCode"
import { useAuth } from "@/context/AuthContext"

const Profile = () => {
  const {user} = useAuth()
  if (!user) {
    return <ErrorCode error={401}/>
  }
  return (
    <div>
      <h1>Profile and Account Information</h1>
      <div className="my-8 grid grid-cols-1 gap-y-2">
        <div className="flex gap-2 items-center">
          <div>Username</div>
          <input placeholder="Username" className="input input-primary h-8"/>
        </div>
        <div>Email: {user.email}</div>
        <div>uid</div>
        <div>acc creation date</div>

        <div>other info</div>
        <div>age/birthday</div>
        <div>location</div>
        <div>full name</div>

        <div>Settings:</div>
        <div>change password:</div>
      </div>
    </div>
  )
}

export default Profile
