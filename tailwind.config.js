/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        base: {
          950: '#060d18',
          900: '#0a1428',
          850: '#0d1b34',
          800: '#111f3a',
          700: '#1a2d4d',
          600: '#243b5e',
          500: '#2e4a6f',
          400: '#4a6a8f',
          300: '#6b8bb0',
          200: '#94adc7',
          100: '#c8d6e5',
          50:  '#f0f4f8',
        },
        accent: {
          DEFAULT: '#38bdf8',
          light:   '#7dd3fc',
          dark:    '#0284c7',
          muted:   'rgba(56, 189, 248, 0.15)',
        },
        teal: {
          DEFAULT: '#2dd4bf',
          light:   '#5eead4',
          dark:    '#0d9488',
          muted:   'rgba(45, 212, 191, 0.15)',
        },
        surface: {
          DEFAULT: 'rgba(10, 20, 40, 0.6)',
          solid:   '#0d1b34',
          hover:   'rgba(10, 20, 40, 0.8)',
          border:  'rgba(56, 189, 248, 0.08)',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'drift': 'drift 20s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'pulse-ring': 'pulse-ring 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
