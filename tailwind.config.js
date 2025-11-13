/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        auto: "repeat(auto-fill, minmax(200px, 1fr))",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        playwrite: ['"Playwrite DE SAS"', "cursive"],
        cursive: ["Great Vibes", "cursive"],
        lobster: ['"Lobster Two"', "cursive"],
      },
      colors: {
        primary: "#5F6FFF",
        brandText: "#ffffff",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
}