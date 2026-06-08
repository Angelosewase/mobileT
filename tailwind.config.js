/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        verbivy: {
          black: "#000000",
          white: "#FFFFFF",
          lavender: "#E8DFF5",
          "lavender-strong": "#C9B8E8",
          purple: "#9B7FD4",
          peach: "#FFE8D9",
          mint: "#D4F0E4",
          border: "#E5E5EA",
          "text-secondary": "#6B6B70",
          "text-tertiary": "#AEAEB2",
          error: "#FF3B30",
          success: "#34C759",
          warning: "#FF9500",
          // Dark mode variants
          "dark-bg": "#000000",
          "dark-surface": "#1C1C1E",
          "dark-elevated": "#2C2C2E",
          "dark-border": "#38383A",
          "dark-lavender": "#2D2640",
          "dark-mint": "#1D3029",
          "dark-peach": "#3D2D25",
        },
      },
      borderRadius: {
        "verbivy-sm": "12px",
        "verbivy-md": "16px",
        "verbivy-lg": "20px",
        "verbivy-pill": "9999px",
      },
    },
  },
  plugins: [],
}