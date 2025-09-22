/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/**/*.{js,jsx,ts,tsx}', // Tailwind will scan all files in src/ with these extensions
    ],
    theme: {
      extend: {
        colors: {
          primary: '#FF6347', // Coral for buttons, highlights
          'primary-dark': '#E55B3C', // Darker coral for hover
          secondary: '#2D3748', // Dark gray for text, backgrounds
          background: '#F7FAFC', // Light gray for page background
          accent: '#48BB78', // Green for success messages
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };