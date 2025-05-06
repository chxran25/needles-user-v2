/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#735D4E',
        secondary: '#BBAD9B',
        background: '#F9F5E7',
        light: {
          100: '#F9F5E7',
          200: '#F0EAD6',
          300: '#E3D9C1',
        },
        dark: {
          100: '#735D4E',
          200: '#5D4B3E',
          300: '#46392F'
        }
      },
      fontFamily: {
        'sans': ['Inter-Regular', 'Helvetica', 'Arial', 'sans-serif'],
        'medium': ['Inter-Medium', 'Helvetica', 'Arial', 'sans-serif'],
        'semibold': ['Inter-SemiBold', 'Helvetica', 'Arial', 'sans-serif'],
        'bold': ['Inter-Bold', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
};