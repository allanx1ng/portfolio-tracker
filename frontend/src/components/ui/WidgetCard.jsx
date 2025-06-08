"use client"

export default function WidgetCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        </div>
      )}
      {children}
    </div>
  )
}
