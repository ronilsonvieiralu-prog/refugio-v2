import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        calm: {
          50: '#f0f9f8',
          100: '#d1f0ec',
          200: '#a3e1d9',
          300: '#75d2c6',
          400: '#47c3b3',
          500: '#2e9d8e', // Sua cor principal
          600: '#247a6f',
          700: '#1a5750',
          800: '#103431',
          900: '#061112',
        },
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config