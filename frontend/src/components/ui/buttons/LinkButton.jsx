"use client"

import React from 'react'

const colors = {
  primary: "text-action-primary hover:text-action-primary/90",
  success: "text-action-success hover:text-action-success/90",
  danger: "text-action-danger hover:text-action-danger/90",
  secondary: "text-text-secondary hover:text-text-primary"
}

const LinkButton = ({
  children,
  className = "",
  disabled = false,
  color = "primary",
  underline = true,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
  
  return (
    <button
      className={`${baseStyles} ${colors[color]} ${underline ? "hover:underline" : ""} ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default LinkButton
