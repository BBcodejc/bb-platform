import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // BB Brand Colors
        gold: {
          50: '#FDF9EF',
          100: '#F9F0D9',
          200: '#F2DFB3',
          300: '#E9C97E',
          400: '#D4B978',
          500: '#C9A961',
          600: '#A68B4B',
          700: '#8A7340',
          800: '#715E35',
          900: '#5D4D2E',
        },
        bb: {
          black: '#0A0A0A',
          dark: '#121212',
          card: '#1A1A1A',
          border: '#2A2A2A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 169, 97, 0.4)' },
          '50%': { boxShadow: '0 0 20px 10px rgba(201, 169, 97, 0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
