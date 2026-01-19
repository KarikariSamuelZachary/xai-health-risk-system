import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1f72ad",
        "primary-dark": "#165a8a",
        "background-light": "#f9fafa",
        "background-dark": "#1a1f23",
        "surface-light": "#ffffff",
        "surface-dark": "#242a30",
        "risk-low": "#3CB94D",
        "risk-moderate": "#FFCA2C",
        "risk-high": "#E65151",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), 
  ],
};
export default config;