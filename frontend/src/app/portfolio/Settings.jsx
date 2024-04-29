"use client"
import { useState } from "react"
const Settings = () => {
  const [isOpen, toggleOpen] = useState(false)
  return (
    <>
      <div className="fixed rounded-10 w-80 h-96 bg-teal-300 bottom-10 right-10" style={{display:isOpen ? 'block': 'none'}}>
        <button className="absolute bg-transparent top-4 right-4" onClick={() => toggleOpen(!isOpen)}>
            X
        </button>
            Settings
      </div>
      {!isOpen && <button className="fixed rounded-full bg-teal-300 w-16 h-16 bottom-10 right-10 " onClick={() => toggleOpen(!isOpen)}></button>}
    </>
  )
}

export default Settings
