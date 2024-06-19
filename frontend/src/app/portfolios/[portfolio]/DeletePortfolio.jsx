"use client"
import apiClient from "@/util/apiClient"
import { errorMsg, successMsg } from "@/util/toastNotifications"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ({ name }) {
  const router = useRouter()
  const [confirmation, setConfirmation] = useState(false)
  const [confirmScreen, setConfirmScreen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (confirmation) {
      deletePortfolio()
    }
  }, [confirmation])
  const deletePortfolio = async () => {
    if (confirmation) {
      try {
        console.log("deleting portfolio")
        console.log(name)
        const res = await apiClient.delete("/portfolio/delete/" + name)
        successMsg("portfolio deleted successfully, redirecting now")
        setTimeout(() => {
          router.push("/portfolios")
        }, 1000)
      } catch (err) {
        errorMsg("err deleting portfolio")
      } finally {
        setConfirmation(false)
        setLoading(false)
      }
    }
  }

  return (
    <div>
      <button onClick={() => setConfirmScreen(true)} className="btn w-full">Delete Portfolio</button>
      {confirmScreen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 h-72 p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <div className="text-center mb-4">This action cannot be undone</div>
            <div className="flex justify-between mt-auto">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                onClick={() => {
                  setConfirmation(true)
                  setConfirmScreen(false)
                }}
              >
                Confirm
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                onClick={() => {
                  setConfirmScreen(false)
                  setConfirmation(false)
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
