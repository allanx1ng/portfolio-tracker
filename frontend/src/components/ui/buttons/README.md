# Button Components

This directory contains a set of reusable button components built with our design system.

## Components

### `Button`
The base button component with multiple variants and states.

```jsx
import { Button } from '@/components/ui/buttons'

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button disabled>Disabled</Button>
<Button isLoading>Loading</Button>
<Button isFullWidth>Full Width</Button>

// With icons
<Button leftIcon={<Icon />}>Left Icon</Button>
<Button rightIcon={<Icon />}>Right Icon</Button>
```

### `IconButton`
A button variant designed specifically for icons.

```jsx
import { IconButton } from '@/components/ui/buttons'

<IconButton
  icon={<Icon />}
  size="md"
  variant="ghost"
  isRound={false}
/>
```

### `LinkButton`
A button that looks like a link.

```jsx
import { LinkButton } from '@/components/ui/buttons'

<LinkButton color="indigo">Link Style</LinkButton>
<LinkButton color="blue" underline={false}>No Underline</LinkButton>
```

## Theme Configuration

The buttons use styles defined in the theme configuration (`/src/config/theme.js`). The theme includes:

- Color variants
- Size presets
- State styles
- Icon sizes
- Spacing
- Typography

To modify the appearance of all buttons consistently, update the theme configuration rather than individual components.

## Example Usage

There's a comprehensive demo of all button variants and states in `ButtonDemo.jsx`. You can import and use it as a reference:

```jsx
import ButtonDemo from '@/components/ui/buttons/ButtonDemo'

// In your page/component:
<ButtonDemo />
```

## Best Practices

1. Use semantic variants:
   - `primary` for main actions
   - `secondary` for alternative actions
   - `ghost` for subtle actions
   - `danger` for destructive actions

2. Maintain consistency:
   - Use the same variant for similar actions across the application
   - Keep button sizes consistent within the same context
   - Use appropriate spacing between buttons

3. Accessibility:
   - Always provide meaningful text for screen readers
   - Ensure proper contrast ratios
   - Maintain appropriate hit areas for touch targets
