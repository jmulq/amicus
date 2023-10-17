/** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        xl: '40px',
        '2xl': '128px',
      },
    },
    extend: {
      colors: {
        primary: {
          300: 'rgb(var(--c-primary-300) / <alpha-value>)',
        },
        secondary: {
          300: 'rgb(var(--c-secondary-300) / <alpha-value>)',
        },
        danger: {
          300: 'rgb(var(--c-danger-300) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
