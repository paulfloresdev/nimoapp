// tailwind.config.js
const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx,html}",
  ],
  darkMode: "class", // Esto ya está correcto
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      backgroundColor: {
        'base': '#0D1318',
        'card': '#121827',
        'light': '#152128'
      },
      height: {
        dscreen: '100dvh'
      }
    },
  },
  plugins: [heroui()],
};
