/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Professional minimal font
      },
      colors: {
        background: '#ffffff',
        foreground: '#09090b', // Almost black for sharp contrast
        border: '#e4e4e7',
      }
    },
  },
  plugins: [],
}
