import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#428177',
          dark: '#054239',
          darker: '#002623',
          foreground: '#FFFFFF',
          50: '#eef5f4',
          100: '#d0e8e5',
          200: '#a1d1cc',
          300: '#72bab2',
          400: '#54a49b',
          500: '#428177',
          600: '#356860',
          700: '#27504a',
          800: '#1a3733',
          900: '#0d1e1c',
        },
        accent: {
          DEFAULT: '#b9a779',
          light: '#edebe0',
          dark: '#988561',
          foreground: '#054239',
          50: '#faf8f2',
          100: '#f2ede0',
          200: '#e5dbc1',
          300: '#d4c49a',
          400: '#c5b084',
          500: '#b9a779',
          600: '#988561',
          700: '#7a6a4d',
          800: '#5a4e39',
          900: '#3a3325',
        },
        umber: {
          DEFAULT: '#6b1f2a',
          dark: '#4a151e',
          darker: '#260f14',
          50: '#fdf2f3',
          100: '#fce7e9',
          200: '#f8d0d5',
          300: '#f2aab2',
          400: '#e97a87',
          500: '#d94f60',
          600: '#c43050',
          700: '#a5233f',
          800: '#8a1f38',
          900: '#6b1f2a',
        },
        charcoal: {
          DEFAULT: '#3d3a3b',
          dark: '#161616',
        },
        background: {
          DEFAULT: '#faf9f7',
          warm: '#edebe0',
        },
      },
      fontFamily: {
        tajawal: ['var(--font-tajawal)', 'Tajawal', 'sans-serif'],
        cairo: ['var(--font-tajawal)', 'Tajawal', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(4, 50, 57, 0.07)',
        'card-hover': '0 8px 32px 0 rgba(4, 50, 57, 0.13)',
        modal: '0 20px 60px 0 rgba(2, 38, 35, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-heart': 'bounceHeart 0.6s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceHeart: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.4)' },
          '60%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
