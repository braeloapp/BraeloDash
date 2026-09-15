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
        background: "var(--background)",
        foreground: "var(--foreground)",
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
          table: "#F5F7F9",
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
      },
      borderRadius: {
        panel: "28px",
      },
    },
  },
  plugins: [],
};
