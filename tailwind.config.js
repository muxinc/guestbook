const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          neon: "#fb68ec",
          DEFAULT: "#fa50b5",
          dark: "#b14886",
        },
        yellow: {
          neon: "#ffdb08",
          DEFAULT: "#ffb200",
          dark: "#bd8209",
        },
      },
      fontFamily: {
        body: ["Aeonik", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
      },
    },
  },
};
