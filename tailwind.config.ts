import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0d0d1a", // purple
        foreground: "#e0e0f8", // light neon text
        card: {
          DEFAULT: "#1f1f35", // dark card base
          foreground: "#e0e0f8",
        },
        popover: {
          DEFAULT: "#12142b", // slightly lighter dark popover
          foreground: "#e0e0f8",
        },
        primary: {
          DEFAULT: "#7f5af0", // neon purple
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#0ff1ce", // neon cyan
          foreground: "#0d0d1a",
        },
        muted: {
          DEFAULT: "#5656ff", // electric blue
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#ff6f91", // neon pink
          foreground: "#0d0d1a",
        },
        destructive: {
          DEFAULT: "#ff4d6d", // hot red
          foreground: "#ffffff",
        },
        border: "#7f5af0", // glowing purple outlines
        input: "#1a1a2e", // dark input background
        ring: "#0ff1ce", // cyan glow
        chart: {
          "1": "#7f5af0",
          "2": "#0ff1ce",
          "3": "#ff6f91",
          "4": "#5656ff",
          "5": "#ffffff",
        },
      },
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
        rounded: "0.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
