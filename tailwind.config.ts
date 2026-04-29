import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          primary: '#F5821A',
          light:   '#FFF0E4',
          mid:     '#FDDCBC',
        },
        dark:    { primary: '#2C1A0E' },
        text:    { primary: '#1A1A1A', secondary: '#7A7A7A' },
        surface: { bg: '#FAF9F7' },
        input:   { bg: '#F5F4F2' },
        border:  { DEFAULT: '#EBEBEB' },
        form:    { sheet: '#FFFFFF' },
        delete:  { DEFAULT: '#E53935' },
        phone:   { shell: '#F5A17A' },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        btn:  '14px',
        input:'12px',
        sheet:'24px 24px 0 0',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        fab:  '0 4px 20px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
}

export default config