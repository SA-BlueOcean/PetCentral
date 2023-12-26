import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  daisyui: {
    logs: false,
    themes: [
      {
        mytheme: {
          primary: "#42558C",
          "primary-content": "#1A1C30",
          secondary: "#7B92B3",
          "secondary-content": "#10141A",
          accent: "#266447",
          neutral: "#EDF2F7",
          "base-100": "#F5F9FF",
          "base-200": "#E6EBF8",
          "base-300": "#DADCE3",
          "base-400": "#A9B4C2",
          "base-500": "#82919E",
          "base-600": "#5B6275",
          "base-700": "#404452",
          "base-800": "#282B33",
          "base-900": "#10141A",
          info: "#ffffff",
          success: "#27BB4B",
          warning: "#D4A73F",
          error: "#AB1C1C",
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("daisyui")],
} satisfies Config;
