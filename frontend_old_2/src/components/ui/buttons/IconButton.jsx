"use client"

import React from 'react'
import Button from './Button'

const sizes = {
  sm: "p-2",
  md: "p-3",
  lg: "p-4"
}

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6"
}

const IconButton = ({
  icon,
  size = "md",
  variant = "ghost",
  isRound = false,
  className = "",
  ...props
}) => {
  const sizeClass = sizes[size]
  const iconSize = iconSizes[size]
  
  // Using our Button component with semantic colors
  return (
    <Button
      variant={variant}
      className={`${sizeClass} p-0 flex items-center justify-center ${isRound ? "rounded-full" : ""} ${className}`.trim()}
      {...props}
    >
      {React.cloneElement(icon, {
        className: `${iconSize} ${icon.props.className || ""}`.trim()
      })}
    </Button>
  )
}

export default IconButton
