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
  
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  
  typography: {
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    }
  },
  
  radius: {
    sm: '0.25rem',
    DEFAULT: '0.375rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px'
  }
}
