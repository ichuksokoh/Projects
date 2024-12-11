/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.text-xxs': {
          fontSize: '0.65rem',
          lineHeight: '0.85rem',
        },
      });
    },
  ],
}