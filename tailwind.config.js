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
        // Core palette — warm editorial
        cream:     '#FAF8F5',
        parchment: '#F0EDE8',
        sand:      '#E2DDD5',
        charcoal:  '#1A1A1A',
        slate:     '#4A4A4A',
        muted:     '#7A7A7A',
        // Accent — deep burgundy / red
        burgundy: {
          50:  '#FDF2F2',
          100: '#FAE0E0',
          200: '#F5C0C0',
          300: '#E89090',
          400: '#D45A5A',
          500: '#B83030',
          600: '#8B1A1A',
          700: '#6E1414',
          800: '#5A1010',
          900: '#3D0B0B',
        },
        // Secondary accent — deep navy
        navy: {
          50:  '#F0F2F5',
          100: '#D8DCE5',
          200: '#B0B9CB',
          400: '#5A6A8A',
          600: '#2C3A56',
          800: '#1A2438',
        },
      },
      fontFamily: {
        serif:    ['"Playfair Display"', 'Georgia', 'serif'],
        sans:     ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:     ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display':  ['3.5rem',  { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'headline': ['2.25rem', { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'title':    ['1.5rem',  { lineHeight: '1.3',  letterSpacing: '-0.005em' }],
        'body':     ['1.0625rem', { lineHeight: '1.7' }],
        'small':    ['0.875rem',  { lineHeight: '1.6' }],
        'caption':  ['0.75rem',   { lineHeight: '1.5', letterSpacing: '0.03em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'article': '42rem',
        'wide':    '72rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1A1A1A',
            a: {
              color: '#8B1A1A',
              textDecoration: 'underline',
              textDecorationColor: '#E89090',
              textUnderlineOffset: '3px',
              '&:hover': {
                color: '#B83030',
              },
            },
            h1: { fontFamily: '"Playfair Display", Georgia, serif' },
            h2: { fontFamily: '"Playfair Display", Georgia, serif' },
            h3: { fontFamily: '"Playfair Display", Georgia, serif' },
            blockquote: {
              borderLeftColor: '#8B1A1A',
              fontStyle: 'italic',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
