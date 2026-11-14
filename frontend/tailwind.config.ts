import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        space: {
          950: "#060913",
          900: "#0B1120",
          850: "#0F172A",
          800: "#131F38",
          700: "#1E293B",
          600: "#334155",
        },
        atmosphere: {
          cyan: "#06b6d4",
          sky: "#38bdf8",
          blue: "#2563eb",
          glow: "rgba(56, 189, 248, 0.15)",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(56, 189, 248, 0.25)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
