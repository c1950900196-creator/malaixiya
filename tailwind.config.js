/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#38e07b',
        'primary-hover': '#2bc75f',
        'background-dark': '#050505',
        'surface-dark': '#121212',
        'surface-darker': '#0a0a0a',
        'card-dark': '#18181b',
        'border-dark': '#27272a',
        'background-light': '#f1f5f9',
        'text-light': '#0f172a',
        'text-dark': '#ffffff',
        'text-muted': '#9ca3af',
      },
      fontFamily: {
        sans: ['Manrope', 'Noto Sans SC', 'Inter', 'sans-serif'],
        display: ['Manrope', 'Noto Sans SC', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.375rem',
      },
      boxShadow: {
        glow: '0 0 15px rgba(56, 224, 123, 0.15)',
        neon: '0 0 10px rgba(56, 224, 123, 0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}





