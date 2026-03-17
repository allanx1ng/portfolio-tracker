const variants = {
  default: "bg-gray-100 text-gray-700 border-gray-200",
  primary: "bg-action-primaryLight text-action-primary border-emerald-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  danger:  "bg-red-50 text-red-700 border-red-200",
  warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
}

const sizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
}

const Badge = ({ variant = "default", size = "md", className = "", dot = false, children }) => {
  const classes = [
    "inline-flex items-center gap-1.5 rounded-full border font-medium",
    variants[variant],
    sizes[size],
    className,
  ].filter(Boolean).join(" ")

  return (
    <span className={classes}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export default Badge
