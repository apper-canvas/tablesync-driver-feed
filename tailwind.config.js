/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00d4ff',
          light: '#4de8ff',
          dark: '#0088cc'
        },
        secondary: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4338ca'
        },
        accent: '#00ff88',
        cyber: {
          pink: '#ff0080',
          purple: '#8000ff',
          blue: '#0080ff',
          green: '#00ff80'
        },
        surface: {
          50: '#f0f4ff',
          100: '#e0e8ff',
          200: '#c7d5ff',
          300: '#a3b8ff',
          400: '#7c8fff',
          500: '#6366f1',
          600: '#4338ca',
          700: '#3730a3',
          800: '#312e81',
          900: '#1e1b4b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(0, 212, 255, 0.15), 0 2px 8px -2px rgba(99, 102, 241, 0.1)',
        'neu-light': '8px 8px 20px rgba(99, 102, 241, 0.1), -8px -8px 20px rgba(255, 255, 255, 0.9)',
        'neu-dark': '8px 8px 20px rgba(0, 0, 0, 0.4), -8px -8px 20px rgba(99, 102, 241, 0.05)',
        'neon': '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)',
        'holo': '0 8px 32px rgba(99, 102, 241, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'cyber': '0 4px 20px rgba(128, 0, 255, 0.3), 0 0 40px rgba(0, 128, 255, 0.2)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
    keyframes: {
      glow: {
        'from': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' },
        'to': { boxShadow: '0 0 30px rgba(0, 212, 255, 0.8), 0 0 40px rgba(99, 102, 241, 0.3)' }
      },
      shimmer: {
        '0%': { backgroundPosition: '-200% 0' },
        '100%': { backgroundPosition: '200% 0' }
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}