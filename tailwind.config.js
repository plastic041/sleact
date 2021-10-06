module.exports = {
  purge: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      borderRadius: ["hover"],
      textColor: ["disabled"],
      cursor: ["disabled"],
    },
  },
  plugins: [],
};
