/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Extended color palette with dark mode considerations
      colors: {
        // Primary color palette
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        
        // Dark mode specific colors
        dark: {
          background: {
            DEFAULT: '#1a202c',
            secondary: '#2d3748',
            tertiary: '#4a5568'
          },
          text: {
            primary: '#e2e8f0',
            secondary: '#cbd5e0',
            muted: '#a0aec0'
          },
          border: '#4a5568',
          accent: {
            DEFAULT: '#4299e1',
            hover: '#3182ce'
          }
        },
        
        // Neutral colors with dark mode variants
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      
      // Extended box shadows for dark mode
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'dark': '0 4px 6px -1px rgba(255, 255, 255, 0.05), 0 2px 4px -1px rgba(255, 255, 255, 0.03)',
      },
      
      // Typography and font sizes
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      },
      
      // Spacing and sizing
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem'
      },
      
      // Border radius
      borderRadius: {
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      
      // Transition durations
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '500': '500ms'
      }
    },
  },
  
  // Variants to enable dark mode for specific utilities
  variants: {
    extend: {
      backgroundColor: ['dark', 'dark-hover', 'dark-group-hover'],
      textColor: ['dark', 'dark-hover', 'dark-group-hover'],
      borderColor: ['dark', 'dark-hover'],
      boxShadow: ['dark', 'dark-hover'],
      opacity: ['dark'],
      transform: ['dark-hover']
    }
  },
  
  // Optional plugins
  plugins: [
    // Example of a custom plugin for dark mode transitions
    function({ addBase, theme }) {
      addBase({
        'html.dark': {
          backgroundColor: theme('colors.dark.background.DEFAULT'),
          color: theme('colors.dark.text.primary'),
          transition: 'background-color 0.3s, color 0.3s'
        }
      })
    }
  ],
}