const bgVariants = {
  light: "bg-white",
  alt:   "bg-gray-50",
  dark:  "bg-slate-900",
  brand: "bg-action-primary",
}

const containerSizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
}

const Section = ({
  variant = "light",
  size = "lg",
  container = true,
  className = "",
  children,
  ...props
}) => {
  return (
    <section
      className={`py-24 px-6 ${bgVariants[variant]} ${className}`}
      {...props}
    >
      {container ? (
        <div className={`${containerSizes[size]} mx-auto`}>
          {children}
        </div>
      ) : children}
    </section>
  )
}

export default Section
