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
    function ({ addUtilities, theme }) {
      addUtilities({
        ".scrollbar": {
          "overflow": "auto",
        },
        ".scrollbar::-webkit-scrollbar": {
          "width": "8px",
          "height": "8px",
        },
        ".scrollbar::-webkit-scrollbar-track": {
          "background": theme("colors.gray.500"),
          "border-radius": "10px",
        },
        ".scrollbar::-webkit-scrollbar-thumb": {
          "background": theme("colors.gray.700"),
          "border-radius": theme("borderRadius.xl"),
        },
        ".scrollbar::-webkit-scrollbar-thumb:hover": {
          "background": theme("colors.gray.800"),
        },
      });
    },
  ],
}