const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        header: "'Yellowtail', sans-serif",
        body: ["LL Akkuratmono Regular Web", ...defaultTheme.fontFamily.sans],
        mono: ["LL Akkuratmono Regular Web", ...defaultTheme.fontFamily.mono],
      },
    },
  },
};
