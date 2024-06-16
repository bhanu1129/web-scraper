/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        helvetica: ['Helvetica', 'Arial', 'sans-serif'],
        'helvetica-bold': ['Helvetica-Bold', 'Arial', 'sans-serif'],
        'helvetica-bold-oblique': ['Helvetica-BoldOblique', 'Arial', 'sans-serif'],
        'helvetica-compressed': ['Helvetica-Compressed', 'Arial', 'sans-serif'],
        'helvetica-light': ['Helvetica-Light', 'Arial', 'sans-serif'],
        'helvetica-oblique': ['Helvetica-Oblique', 'Arial', 'sans-serif'],
        'helvetica-rounded-bold': ['Helvetica-Rounded-Bold', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}