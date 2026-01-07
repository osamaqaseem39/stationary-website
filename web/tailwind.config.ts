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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        pink: {
          DEFAULT: '#FF69B4',
          light: '#FFB6C1',
          dark: '#FF1493',
        },
        blue: {
          DEFAULT: '#87CEEB',
          light: '#B0E0E6',
          dark: '#4682B4',
        },
      },
    },
  },
  plugins: [],
}
export default config

