/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic colors
        text: {
          primary: '#111827',    // gray-900
          secondary: '#6b7280',  // gray-500
          muted: '#9ca3af',      // gray-400
          inverted: '#ffffff'
        },
        bg: {
          page: '#f9fafb',      // gray-50
          card: '#ffffff',
          alt: '#f3f4f6'        // gray-100
        },
        border: {
          DEFAULT: '#e5e7eb',    // gray-200
          focus: '#6366f1'       // indigo-500
        },
        action: {
          primary: '#4f46e5',    // indigo-600
          danger: '#dc2626',     // red-600
          success: '#16a34a',    // green-600
          warning: '#ca8a04'     // yellow-600
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      width: {
        "100px": "100px",
        "200px": "200px",
        "300px": "300px",
        "400px": "400px",
        "500px": "500px",
        "600px": "600px",
        "800px": "800px",
        "1000px": "1000px",
      },
      height: {
        "100px": "100px",
        "200px": "200px",
        "300px": "300px",
        "400px": "400px",
        "500px": "500px",
        "600px": "600px",
        "800px": "800px",
      },
      gridTemplateColumns: {
        fixed: "repeat(3, 200px)",
        "flex-fixed": "200px 1fr",
      },
    },
  },
  plugins: [require("tailwindcss-filters")]
}
