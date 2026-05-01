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
        // Legacy tokens remapped to zinc/white — keeps old classes working
        cream:     '#ffffff',
        parchment: '#F4F4F5',
        sand:      '#E4E4E7',
        charcoal:  '#18181B',
        slate:     '#52525B',
        muted:     '#A1A1AA',
        // Primary accent
        accent:  '#E24B4A',
        sidebar: '#18181B',
        // Burgundy remapped to accent range
        burgundy: {
          50:  '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#E24B4A',
          700: '#C73B3A',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        navy: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          400: '#9CA3AF',
          600: '#6B7280',
          800: '#374151',
        },
      },
      fontFamily: {
        serif: ['Inter', 'system-ui', 'sans-serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display':  ['2rem',     { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'headline': ['1.375rem', { lineHeight: '1.3',  letterSpacing: '-0.01em' }],
        'title':    ['1.0625rem', { lineHeight: '1.35' }],
        'body':     ['0.9375rem', { lineHeight: '1.65' }],
        'small':    ['0.8125rem', { lineHeight: '1.55' }],
        'caption':  ['0.6875rem', { lineHeight: '1.4',  letterSpacing: '0.02em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      maxWidth: {
        'article': '42.5rem',
        'wide':    '72rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#18181B',
            fontFamily: 'Inter, system-ui, sans-serif',
            a: {
              color: '#E24B4A',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              '&:hover': { color: '#C73B3A' },
            },
            h1: { fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '500' },
            h2: { fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '500' },
            h3: { fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '500' },
            blockquote: { borderLeftColor: '#E24B4A', fontStyle: 'normal' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
