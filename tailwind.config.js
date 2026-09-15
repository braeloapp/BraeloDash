/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-text-primary)",
        surface: "var(--color-surface)",
        elevated: "var(--color-surface-elevated)",
        border: "var(--color-border)",
        brand: {
          gold: "#CD9403",
          hover: "#b37f02",
          soft: "#D8B039",
          bright: "#FFCC35",
          warn: "#EE9E03",
          cream: "#feefcb",
          sidebar: "#3a4248",
          muted: "#78828A",
          faint: "#ACB6BE",
          canvas: "#F6F8FB",
          ink: "#232F30",
          success: "#06B64C",
          danger: "#C7233F",
          info: "#2F6FED",
          table: "#F5F7F9",
          DEFAULT: "#CD9403",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "Arial",
          "Helvetica",
          "sans-serif",
        ],
        plus: [
          "var(--font-geist-sans)",
          "Arial",
          "Helvetica",
          "sans-serif",
        ],
      },
      boxShadow: {
        panel: "0 12px 40px rgba(58, 66, 72, 0.08)",
        card: "0 8px 24px rgba(58, 66, 72, 0.06)",
        focus: "0 0 0 3px rgba(205, 148, 3, 0.16)",
        brand: "0 8px 18px rgba(205, 148, 3, 0.22)",
      },
      borderRadius: {
        panel: "28px",
        card: "18px",
        control: "12px",
      },
      spacing: {
        4.5: "1.125rem",
        13: "3.25rem",
        18: "4.5rem",
      },
      transitionDuration: {
        fast: "150ms",
        base: "200ms",
      },
    },
  },
  plugins: [],
};
