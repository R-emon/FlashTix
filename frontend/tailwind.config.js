/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'], // A punchy, modern font for headers
      },
      colors: {
        brand: {
          DEFAULT: '#6366f1', // Electric Indigo
          neon: '#f43f5e', // Neon Rose
          dark: '#030712', // Deep Void Black
          card: '#111827', // Slightly lighter card background
        }
      }
    },
  },
  plugins: [],
}
