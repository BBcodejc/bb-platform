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
        },
        // Site Rebuild Colors
        site: {
          primary: '#080B14',
          secondary: '#0F1420',
          card: '#161B2A',
          'card-hover': '#1C2236',
          border: '#1E2538',
          gold: '#D4A017',
          'gold-hover': '#E8B82A',
          'gold-dark': '#A67C12',
          muted: '#8B9CB6',
          dim: '#5A6680',
          success: '#22C55E',
          danger: '#EF4444',
        },
        mc: {
          navy: '#0A0E1A',
          charcoal: '#141824',
          card: '#1C2033',
          border: '#2A2E42',
          amber: '#F5A623',
          'amber-light': '#FFB800',
          'amber-dark': '#D4891A',
          green: '#00E676',
          red: '#FF4444',
          muted: '#8B9CB6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        oswald: ['var(--font-oswald)', 'sans-serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
        barlow: ['var(--font-barlow)', 'sans-serif'],
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
