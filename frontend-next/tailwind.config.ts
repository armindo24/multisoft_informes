import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0f766e',
          700: '#115e59',
          900: '#042f2e'
        }
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.08)'
      }
    },
  },
  plugins: [],
} satisfies Config;
