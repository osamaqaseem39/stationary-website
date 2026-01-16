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
        primary: {
          DEFAULT: '#517ade',
          light: '#6b8fe8',
          dark: '#3d5fc7',
        },
        secondary: {
          DEFAULT: '#ffd949',
          light: '#ffe066',
          dark: '#ffcc00',
        },
        black: '#000000',
        white: '#ffffff',
      },
    },
  },
  plugins: [],
}
export default config
