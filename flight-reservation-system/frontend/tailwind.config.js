/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'sky-blue': '#0EA5E9',
        'navy': '#1E3A8A',
      },
    },
  },
  plugins: [],
}

