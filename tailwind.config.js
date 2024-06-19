/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        victoria: {
          50: "#f4f3fb",
          100: "#e5e3f6",
          200: "#cfcdf0",
          300: "#afabe5",
          400: "#8882d8",
          500: "#7465cc",
          600: "#6851bf",
          700: "#6247ae",
          800: "#584092",
          900: "#463672",
          950: "#2f2546",
        },

        wisteria: {
          50: "#f9f7fb",
          100: "#f2f0f7",
          200: "#e8e3f1",
          300: "#d7cce6",
          400: "#c1afd6",
          500: "#a98ec4",
          600: "#936daf",
          700: "#8761a0",
          800: "#715186",
          900: "#5d446e",
          950: "#3c2c49",
        },
      },
    },
  },
  plugins: [],
};
