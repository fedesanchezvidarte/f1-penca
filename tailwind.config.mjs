import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card-background)",
        border: "var(--border-color)",
        "text-secondary": "var(--text-secondary)",
        "text-disabled": "var(--text-disabled)",
        "accent-red": "var(--accent-red)",
        "accent-blue": "var(--accent-blue)",
        "accent-red-hover": "var(--accent-red-hover)",
        "accent-blue-hover": "var(--accent-blue-hover)",
        success: "var(--success)",
        warning: "var(--warning)",
      },
    },
  },
  plugins: [heroui()],
};

export default config;
