/** @type {import('tailwindcss').Config} */
export default {
  content: [  "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
      customBlue: '#e5e7fa',
      buttonColor1: "#624fb3",
      buttonColor2:"#9794e5",
      buttonColor3:"#705fa3",
      buttonColor4:"#2d283e",
    hoverColor:"#9f90c2"
      }
    },
  },
  plugins: [],
}

