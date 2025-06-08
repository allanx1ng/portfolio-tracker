"use client"

export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{message}</h1>
        <p className="text-gray-600">Please wait while we fetch your data.</p>
      </div>
    </div>
  )
}
