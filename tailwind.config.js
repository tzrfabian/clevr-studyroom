/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          "primary": "#1d4ed8",
          "primary-content": "#ffffff",
          "base-100": "#ffffff",
          "base-content": "#1f2937",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          "primary": "#3b82f6",
          "primary-content": "#ffffff",
          "base-100": "#1f2937",
          "base-content": "#f3f4f6",
        },
      },
    ],
  },
}