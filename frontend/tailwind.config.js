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
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
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
      }
    },
  },
  plugins: [],
};
