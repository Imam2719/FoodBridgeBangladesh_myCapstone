/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Existing color palette
        dark: {
          background: '#1a202c',
          text: '#e2e8f0',
          card: '#2d3748',
          border: '#4a5568',
          accent: '#4299e1'
        }
      },
      backgroundColor: {
        dark: {
          primary: '#4299e1',
          secondary: '#718096',
          card: '#2d3748'
        }
      },
      textColor: {
        dark: {
          primary: '#e2e8f0',
          secondary: '#cbd5e0'
        }
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
      borderColor: ['dark']
    }
  },
  plugins: [],
}