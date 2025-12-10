/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2E7D32", // Eco Green
        secondary: "#81C784", // Light Green
        accent: "#E8F5E9", // Very light green background
        dark: "#1B1B1B",
        grey: "#F5F5F5", // Soft Grey
        text: "#374151",
      },
    },
  },
  plugins: [],
}