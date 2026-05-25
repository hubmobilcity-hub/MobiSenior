/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:   '#125491',
          electric:  '#389ecf',
          text:      '#2674a5',
          bg:        '#b5c7de',
          orange:    '#cb6131',
        },
        senior: {
          mobi:    '#125491',
          salud:   '#2d9e5f',
          familia: '#e8a020',
          ayuda:   '#d93025',
        },
      },
      fontFamily: {
        display: ['Afacad Flux', 'system-ui', 'sans-serif'],
        body:    ['Afacad Flux', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'senior-sm':  ['18px', { lineHeight: '1.5' }],
        'senior-base':['20px', { lineHeight: '1.5' }],
        'senior-lg':  ['24px', { lineHeight: '1.4', fontWeight: '700' }],
        'senior-xl':  ['32px', { lineHeight: '1.3', fontWeight: '800' }],
      },
      borderRadius: {
        'xl':  '18px',
        '2xl': '24px',
        '3xl': '32px',
        'pill':'999px',
      },
      boxShadow: {
        'brand-sm': '0 2px 6px rgba(18,84,145,0.10)',
        'brand-md': '0 6px 16px rgba(18,84,145,0.12)',
        'brand-lg': '0 14px 32px rgba(18,84,145,0.16)',
        'action':   '0 8px 20px rgba(203,97,49,0.30)',
      },
      minHeight: {
        'btn': '160px',
      },
      minWidth: {
        'btn': '160px',
      },
    },
  },
  plugins: [],
}
