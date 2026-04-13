import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vodafone: {
          red: "#E60000",
        },
        red: {
          dark: "#CC0000",
          darker: "#B30000",
          light: "#FF4D4D",
          bg: "#FFF0F0",
          "bg-alt": "#FFEAEA",
        },
        page: "#F5F5F7",
        heading: "#1a1a1a",
        body: "#666666",
        "body-light": "#777777",
        muted: "#aaaaaa",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        modal: "24px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 8px 30px rgba(0, 0, 0, 0.10)",
        modal: "0 25px 60px rgba(0, 0, 0, 0.15)",
      },
      keyframes: {
        "skeleton-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "dot-pulse": {
          "0%, 80%, 100%": { opacity: "0" },
          "40%": { opacity: "1" },
        },
        "modal-in": {
          "0%": { opacity: "0", transform: "scale(0.95) translateY(10px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "overlay-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "skeleton-pulse": "skeleton-pulse 1.8s ease-in-out infinite",
        "dot-pulse": "dot-pulse 1.4s ease-in-out infinite",
        "modal-in": "modal-in 0.2s ease-out",
        "overlay-in": "overlay-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
