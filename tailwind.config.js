/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.{js,ts,tsx}', './app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primaryBg: '#f7cac9',
        secondary: '#add8e6',
        tertiary: '#ff9933',
        primary: '#001253',
      },
    },
  },
  plugins: [],
};
