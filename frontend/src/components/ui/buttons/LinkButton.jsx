"use client"

import React from 'react'
import { theme } from '@/config/theme'

const LinkButton = ({
  children,
  className = "",
  disabled = false,
  color = "indigo",
  underline = true,
  ...props
}) => {
  const { base, colors } = theme.components.link
  
  return (
    <button
      className={`${base} ${colors[color]} ${underline ? "hover:underline" : ""} ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default LinkButton
