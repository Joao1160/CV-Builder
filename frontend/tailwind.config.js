/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E8B73',
          dark:    '#148074',
          alt:     '#3a8b73',
          light:   '#3dbf8a',
          teal:    '#1a9e8f',
          50:      '#edfaf5',
          100:     '#d0f5e7',
          200:     '#a3ead1',
          500:     '#2E8B73',
          600:     '#148074',
          700:     '#0f6560',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #3dbf8a 0%, #1a9e8f 50%, #148074 100%)',
        'brand-soft':     'linear-gradient(135deg, #edfaf5 0%, #d0f5e7 100%)',
      },
      boxShadow: {
        'brand':    '0 4px 24px rgba(46,139,115,0.18)',
        'brand-lg': '0 8px 40px rgba(46,139,115,0.22)',
      },
      animation: {
        'fade-up':   'fadeUp 0.5s ease forwards',
        'fade-in':   'fadeIn 0.4s ease forwards',
        'slide-in':  'slideIn 0.35s ease forwards',
        'pulse-soft':'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn:   { from: { opacity: 0, transform: 'translateX(-12px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
      },
    },
  },
  plugins: [],
}
