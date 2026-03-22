const defaultColors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pb-bg':      '#0A0E1A',
        'pb-surface': '#111827',
        'pb-surface2':'#1A2235',
        'pb-border':  'rgba(255,255,255,0.07)',
        'pb-border2': 'rgba(255,255,255,0.13)',
        'pb-blue':    '#2563EB',
        'pb-blue-lt': '#60A5FA',
        'pb-green':   '#22C55E',
        'pb-red':     '#EF4444',
        'pb-amber':   '#F59E0B',
        'pb-text':    '#F1F5F9',
        'pb-muted':   '#94A3B8',
        'pb-hint':    '#475569',

        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border: 'var(--border)',
        'border-light': 'var(--border-light)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        accent: 'var(--accent)',
        'accent-light': 'var(--accent-light)',
        accent2: 'var(--accent-2)',
        'accent2-light': '#FDECE7',
        blue: {
          ...defaultColors.blue,
          DEFAULT: 'var(--blue)',
          light: 'var(--blue-light)',
        },
        purple: {
          ...defaultColors.purple,
          DEFAULT: 'var(--purple)',
          light: 'var(--purple-light)',
        },
      },
      boxShadow: {
        card: 'var(--shadow)',
        'card-lg': 'var(--shadow-lg)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        tight: '-0.02em',
        tighter: '-0.03em',
      },
    },
  },
  plugins: [],
}

