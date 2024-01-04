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

      colors: {
        "base-400": "#A9B4C2",
        "base-500": "#82919E",
        "base-600": "#5B6275",
        "base-700": "#404452",
        "base-800": "#282B33",
        "base-900": "#10141A",
      },
      keyframes: {
        flyR: {
          "0%": { transform: "translate(0%, 0%) rotate (0)", opacity: "1" },
          "25%": { transform: "translate(20%, -20%) rotate(10deg)" },
          "50%": {
            transform: "translate(50%, -35%) rotate(25deg)",
            opacity: "0.95",
          },
          "75%": { transform: "translate(75%, -45%) rotate(40deg)" },
          "100%": {
            transform: "translate(120%, -50%) rotate(55deg)",
            opacity: "0",
            visibility: "hidden",
          },
        },
        flyL: {
          "0%": { transform: "translate(0%, 0%) rotate (0)", opacity: "1" },
          "25%": { transform: "translate(-20%, -20%) rotate(-10deg)" },
          "50%": {
            transform: "translate(-50%, -35%) rotate(-25deg)",
            opacity: "0.95",
          },
          "75%": { transform: "translate(-75%, -45%) rotate(-40deg)" },
          "100%": {
            transform: "translate(-120%, -50%) rotate(-55deg)",
            opacity: "0",
            visiblity: "hidden",
          },
        },
      },
      animation: {
        flyR: "flyR 300ms ease-in forwards",
        flyL: "flyL 300ms ease-in forwards",
      },
    },
  },
  plugins: [require("daisyui")],
} satisfies Config;
