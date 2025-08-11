// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
      },
      animation: {
        typing: "typing 2s linear forwards",
      },
    },
  },
  plugins: [],
};
