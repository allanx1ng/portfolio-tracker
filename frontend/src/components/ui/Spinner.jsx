const sizes = {
  xs: "w-4 h-4 border-2",
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-4",
  lg: "w-12 h-12 border-4",
}

export default function Spinner({ size = "md", className = "" }) {
  return (
    <span
      className={`inline-block rounded-full border-current border-t-transparent animate-spin ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}

export function PageSpinner({ size = "lg" }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size={size} className="text-action-primary" />
    </div>
  )
}
