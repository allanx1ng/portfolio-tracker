"use client"

export default function ErrorState({ message = "An error occurred", details = null }) {
  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4">
          <svg className="h-12 w-12 text-action-danger mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">{message}</h1>
        {details && <p className="text-text-secondary">{details}</p>}
      </div>
    </div>
  )
}
