"use client"

import React from 'react'
import { theme } from '@/config/theme'

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
  const { base, variants, sizes } = theme.components.button
  const variantStyles = variants[variant]
  const sizeStyles = sizes[size]
  
  const classes = `${base} ${variantStyles.base} ${variantStyles.hover} ${variantStyles.active} ${sizeStyles} ${isFullWidth ? "w-full" : ""} ${disabled || isLoading ? variantStyles.disabled : ""} ${className}`.trim()

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
