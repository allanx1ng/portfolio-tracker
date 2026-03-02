"use client"

import React from 'react'
import Spinner from '@/components/ui/Spinner'

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
          <Spinner size="sm" className="-ml-1 mr-3" />
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
