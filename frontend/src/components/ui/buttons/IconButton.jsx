"use client"

import React from 'react'
import Button from './Button'
import { theme } from '@/config/theme'

const IconButton = ({
  icon,
  size = "md",
  variant = "ghost",
  isRound = false,
  className = "",
  ...props
}) => {
  const { sizes, padding } = theme.components.icon
  const sizeClass = padding[size]
  const iconSize = sizes[size]
  
  return (
    <Button
      variant={variant}
      size={size}
      className={`${sizeClass} p-0 flex items-center justify-center ${isRound ? "rounded-full" : "rounded-md"} ${className}`.trim()}
      {...props}
    >
      {React.cloneElement(icon, {
        className: `${iconSize} ${icon.props.className || ""}`.trim()
      })}
    </Button>
  )
}

export default IconButton
