const Input = ({
  label,
  id,
  error,
  helper,
  className = "",
  ...props
}) => {
  const inputClasses = [
    "w-full px-3 py-2 text-sm rounded-md border",
    "bg-bg-card text-text-primary placeholder:text-text-muted",
    "focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-bg-alt",
    "transition-colors",
    error
      ? "border-action-danger focus:ring-action-danger"
      : "border-border hover:border-gray-300",
    className,
  ].filter(Boolean).join(" ")

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input id={id} className={inputClasses} {...props} />
      {error && (
        <p className="text-xs text-action-danger font-normal">{error}</p>
      )}
      {helper && !error && (
        <p className="text-xs text-text-secondary font-normal">{helper}</p>
      )}
    </div>
  )
}

export default Input
