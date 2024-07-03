/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
      },
      gridTemplateColumns: {
        fixed: "repeat(3, 200px)", // Two columns each 200px wide
        "flex-fixed": "200px 1fr", // One fixed and one flexible column
      },
    },
    // variants: {
    //   backdropFilter: ["responsive"], // Add this line
    // },
  },
  plugins: [require("daisyui"), require("tailwindcss-filters")],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
      {
        moon_night: {
          primary: "#3855CC",

          secondary: "#66B3FF",

          accent: "#cceeff",

          neutral: "#2c3141",

          "base-100": "#2c3141",

          info: "#38bdf8",

          success: "#4ade80",

          warning: "#fb923c",

          error: "#ef4444",
        },
      },
      {
        custom_light_2: {
          primary: "#a855f7",

          secondary: "#d8b4fe",

          accent: "#2dd4bf",

          neutral: "#d1d5db",

          "base-100": "#ffffff",

          info: "#7dd3fc",

          success: "#4ade80",

          warning: "#fbbf24",

          error: "#f43f5e",
        },
      },
      {
        custom_light: {
          primary: "#065f46",

          secondary: "#34d399",

          accent: "#fb923c",

          neutral: "#d1d5db",

          "base-100": "#f3f4f6",

          info: "#7dd3fc",

          success: "#4ade80",

          warning: "#fbbf24",

          error: "#f43f5e",
        },
      },
      {
        custom_dark: {
          primary: "#10b981",

          secondary: "#a7f3d0",

          accent: "#fb923c",

          neutral: "#6b7280",

          "base-100": "#1f2937",

          info: "#7dd3fc",

          success: "#4ade80",

          warning: "#fbbf24",

          error: "#f43f5e",
        },
      },
      {
        firey: {
          primary: "#FF4B5C",

          secondary: "#FFB500",

          tertiary: "#FF6F61",

          accent: "#00BFA5",

          // neutral: "#FFF5F5",
          // neutral: "#f5f5f5",

          neutral: "#FFF5F5",

          "base-100": "#f5f5f5",

          info: "#7dd3fc",

          success: "#4ade80",

          warning: "#fbbf24",

          error: "#f43f5e",
        },
      },
      {
        green: {
          primary: "#0d9488",

          secondary: "#ccfbf1",

          accent: "#FF4B5C",

          neutral: "#FFF5F5",

          "base-100": "#f5f5f5",

          info: "#7dd3fc",

          success: "#4ade80",

          warning: "#fbbf24",

          error: "#f43f5e",
        },
      },
    ],
  },
}
