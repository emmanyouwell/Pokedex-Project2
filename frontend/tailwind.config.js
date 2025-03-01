/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        holtwood: ["Holtwood One SC", "serif"],
        dm: ["DM Serif Text", "serif"],
        parkinsans: ["Parkinsans", "serif"],
        inter: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}

