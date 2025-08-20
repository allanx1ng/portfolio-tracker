"use client"

import React from 'react'

const variants = {
  primary: {
    base: "bg-action-primary text-text-inverted border border-transparent",
    hover: "hover:bg-action-primary/90",
    active: "active:bg-action-primary/80",
    disabled: "opacity-50 cursor-not-allowed"
  },
  secondary: {
    base: "bg-bg-alt text-text-primary border border-transparent",
    hover: "hover:bg-bg-alt/80",
    active: "active:bg-bg-alt/70",
    disabled: "opacity-50 cursor-not-allowed"
  },
  outline: {
    base: "bg-transparent border border-action-primary text-action-primary",
    hover: "hover:bg-action-primary/10",
    active: "active:bg-action-primary/20",
    disabled: "opacity-50 cursor-not-allowed"
  },
  ghost: {
    base: "bg-transparent text-text-secondary",
    hover: "hover:bg-bg-alt",
    active: "active:bg-bg-alt/70",
    disabled: "opacity-50 cursor-not-allowed"
  },
  danger: {
    base: "bg-action-danger text-text-inverted border border-transparent",
    hover: "hover:bg-action-danger/90",
    active: "active:bg-action-danger/80",
    disabled: "opacity-50 cursor-not-allowed"
  }
}

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg"
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  leftIcon,
  rightIcon,
  isFullWidth = false,
  isLoading = false,
  loadingText = "Loading...",
  disabled = false,
  ...props
}) => {
  const variantStyles = variants[variant]
  const sizeStyles = sizes[size]
  
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-action-primary focus:ring-offset-2"
  
  const classes = `${baseStyles} ${variantStyles.base} ${variantStyles.hover} ${variantStyles.active} ${sizeStyles} ${isFullWidth ? "w-full" : ""} ${disabled || isLoading ? variantStyles.disabled : ""} ${className}`.trim()

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-3 h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}

export default Button
