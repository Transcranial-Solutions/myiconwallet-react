const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    colors: require('./src/utils/colors'),
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {},
  plugins: [],
};
