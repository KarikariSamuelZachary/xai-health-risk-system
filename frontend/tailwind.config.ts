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
        primary: "#566978",
        "primary-dark": "#445866",
        "background-light": "#f3f5f6",
        "background-dark": "#1a1f23",
        "surface-light": "#ffffff",
        "surface-muted": "#f7f8f9",
        "surface-dark": "#242a30",
        "border-soft": "#d7dde2",
        "risk-low": "#6f8576",
        "risk-moderate": "#b28957",
        "risk-high": "#8c6262",
      },
      fontFamily: {
        display: ["Manrope", "system-ui", "sans-serif"],
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
