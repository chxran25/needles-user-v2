/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#B4473A', // warm red
        background: '#F5F5F5', // white smoke
        textDark: '#222222',
        textMuted: '#666666',
        card: '#FFFFFF',
        border: '#E0E0E0',
        light: {
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
        },
      },
      fontFamily: {
        sans: ['Inter-Regular', 'Helvetica', 'Arial', 'sans-serif'],
        medium: ['Inter-Medium', 'Helvetica', 'Arial', 'sans-serif'],
        semibold: ['Inter-SemiBold', 'Helvetica', 'Arial', 'sans-serif'],
        bold: ['Inter-Bold', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.04)',
        soft: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
};
