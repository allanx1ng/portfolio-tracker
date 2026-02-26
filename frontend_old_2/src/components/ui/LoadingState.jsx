"use client"

export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-action-primary mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">{message}</h1>
        <p className="text-text-secondary">Please wait while we fetch your data.</p>
      </div>
    </div>
  )
}
