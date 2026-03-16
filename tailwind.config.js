/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        bg: '#f9f8f6',
        surface: '#ffffff',
        'surface-2': '#f3f2ef',
        border: '#e8e5e0',
        'border-light': '#f0ede8',
        'text-primary': '#1a1916',
        'text-secondary': '#6b6760',
        'text-tertiary': '#a09d98',
        accent: {
          DEFAULT: '#2d6a4f',
          light: '#e8f4ee',
        },
        accent2: {
          DEFAULT: '#e76f51',
          light: '#fdf0ec',
        },
        blue: {
          DEFAULT: '#3b5bdb',
          light: '#e8f0fe',
        },
        purple: {
          DEFAULT: '#7c3aed',
          light: '#f3e8ff',
        },
      },
      borderRadius: {
        DEFAULT: '10px',
        sm: '6px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        lg: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
