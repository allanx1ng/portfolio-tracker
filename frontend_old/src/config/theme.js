export const theme = {
  colors: {
    // Primary colors (based on Tailwind's indigo palette)
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',  // Main primary color
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81'
    },
    // Gray palette for neutral colors
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },
    
    // Semantic colors
    semantic: {
      text: {
        primary: '#111827',    // gray-900
        secondary: '#6b7280',  // gray-500
        muted: '#9ca3af',      // gray-400
        inverted: '#ffffff'
      },
      background: {
        page: '#f9fafb',       // gray-50
        card: '#ffffff',
        alt: '#f3f4f6'         // gray-100
      },
      border: {
        default: '#e5e7eb',    // gray-200
        focus: '#6366f1'       // indigo-500
      },
      action: {
        primary: '#4f46e5',    // indigo-600
        danger: '#dc2626',     // red-600
        success: '#16a34a',    // green-600
        warning: '#ca8a04'     // yellow-600
      }
    }
  },

  typography: {
    fonts: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    },
    sizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem'   // 36px
    },
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    styles: {
      // Text styles that combine size, weight, and colors
      h1: {
        size: '3xl',
        weight: 'bold',
        color: 'text.primary'
      },
      h2: {
        size: '2xl',
        weight: 'semibold',
        color: 'text.primary'
      },
      h3: {
        size: 'xl',
        weight: 'semibold',
        color: 'text.primary'
      },
      h4: {
        size: 'lg',
        weight: 'medium',
        color: 'text.primary'
      },
      body: {
        size: 'base',
        weight: 'normal',
        color: 'text.primary'
      },
      'body-small': {
        size: 'sm',
        weight: 'normal',
        color: 'text.primary'
      },
      'body-large': {
        size: 'lg',
        weight: 'normal',
        color: 'text.primary'
      },
      caption: {
        size: 'sm',
        weight: 'normal',
        color: 'text.secondary'
      },
      label: {
        size: 'sm',
        weight: 'medium',
        color: 'text.secondary'
      }
    }
  },

  // Component-specific tokens
  components: {
    button: {
      variants: {
        primary: {
          base: 'bg-indigo-600 text-white border border-transparent',
          hover: 'hover:bg-indigo-700',
          active: 'active:bg-indigo-800',
          disabled: 'opacity-50 cursor-not-allowed'
        },
        secondary: {
          base: 'bg-gray-200 text-gray-900 border border-transparent',
          hover: 'hover:bg-gray-300',
          active: 'active:bg-gray-400',
          disabled: 'opacity-50 cursor-not-allowed'
        },
        outline: {
          base: 'bg-transparent border border-indigo-600 text-indigo-600',
          hover: 'hover:bg-indigo-50',
          active: 'active:bg-indigo-100',
          disabled: 'opacity-50 cursor-not-allowed'
        },
        ghost: {
          base: 'bg-transparent text-gray-600',
          hover: 'hover:bg-gray-100',
          active: 'active:bg-gray-200',
          disabled: 'opacity-50 cursor-not-allowed'
        },
        danger: {
          base: 'bg-red-600 text-white border border-transparent',
          hover: 'hover:bg-red-700',
          active: 'active:bg-red-800',
          disabled: 'opacity-50 cursor-not-allowed'
        }
      },
      sizes: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
      },
      base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
    },
    link: {
      colors: {
        indigo: 'text-indigo-600 hover:text-indigo-700',
        blue: 'text-blue-600 hover:text-blue-700',
        red: 'text-red-600 hover:text-red-700',
        green: 'text-green-600 hover:text-green-700',
        gray: 'text-gray-600 hover:text-gray-700'
      },
      base: 'inline-flex items-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
    },
    icon: {
      sizes: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
      },
      padding: {
        sm: 'p-2',
        md: 'p-3',
        lg: 'p-4'
      }
    }
  },
  
  // Layout and spacing
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem'
  },

  radius: {
    none: '0',
    sm: '0.25rem',
    DEFAULT: '0.375rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
}
