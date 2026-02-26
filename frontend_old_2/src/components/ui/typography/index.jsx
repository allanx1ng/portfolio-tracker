import React from 'react'
import { theme } from '@/config/theme'

// Helper function to get text style classes from theme
const getTextStyle = (variant) => {
  const style = theme.typography.styles[variant]
  return `text-${style.size} font-${style.weight} text-semantic-${style.color}`
}

export function Text({ 
  variant = "body", 
  as: Component = "p",
  className = "", 
  children, 
  ...props 
}) {
  const styleClasses = getTextStyle(variant)
  return (
    <Component className={`${styleClasses} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}

export function Heading({ 
  level = 1, 
  variant, 
  className = "", 
  children,
  ...props 
}) {
  const Component = `h${level}`
  // If no variant specified, use h1-h4 based on level
  const styleVariant = variant || (level <= 4 ? `h${level}` : 'h4')
  const styleClasses = getTextStyle(styleVariant)
  
  return (
    <Component className={`${styleClasses} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}

export function Label({
  className = "",
  children,
  ...props
}) {
  const styleClasses = getTextStyle('label')
  return (
    <span className={`${styleClasses} ${className}`.trim()} {...props}>
      {children}
    </span>
  )
}

export function Caption({
  className = "",
  children,
  ...props
}) {
  const styleClasses = getTextStyle('caption')
  return (
    <span className={`${styleClasses} ${className}`.trim()} {...props}>
      {children}
    </span>
  )
}

// Example usage:
// <Text>Default body text</Text>
// <Text variant="body-small">Smaller text</Text>
// <Heading level={1}>Main heading</Heading>
// <Heading level={2}>Subheading</Heading>
// <Label>Form label</Label>
// <Caption>Small caption text</Caption>
