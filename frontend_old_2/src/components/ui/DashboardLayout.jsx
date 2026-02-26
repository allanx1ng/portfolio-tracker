"use client"

import { TimeframeProvider, TimeframeSelector } from "../charts/line/TimeframeContext"
import LoadingState from "./LoadingState"
import ErrorState from "./ErrorState"

export default function DashboardLayout({
  title,
  headerActions,
  isLoading,
  error,
  hasTimeframeSelector = true,
  children
}) {
  if (isLoading) {
    return <LoadingState message={`Loading ${title.toLowerCase()}...`} />
  }

  if (error) {
    return <ErrorState message={`Error loading ${title.toLowerCase()}`} details={error} />
  }

  const content = (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {headerActions && (
            <div className="flex space-x-3">
              {headerActions}
            </div>
          )}
        </div>

        {hasTimeframeSelector && (
          <div className="flex justify-end mb-4">
            <TimeframeSelector />
          </div>
        )}

        {children}
      </div>
    </div>
  )

  return hasTimeframeSelector ? (
    <TimeframeProvider>{content}</TimeframeProvider>
  ) : content
}
