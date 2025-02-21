/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'palestine-red': '#E62643',
        'palestine-black': '#000000',
        'palestine-white': '#FFFFFF',
        'palestine-green': '#098850',
      },
    },
  },
  plugins: [],
};
