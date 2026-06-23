/** @type {import('tailwindcss').Config} */
// Note: this project uses Tailwind v4 via the Vite plugin and the CSS-first
// config in src/index.css (@theme). This file is kept in sync for tooling /
// editor hints only. The warm-amber accent and Outfit font are the source of
// truth in index.css.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0c0c0e',
        surface: '#1c1c20',
        primary: '#ffffff',
        accent: '#d99a36',
        secondary: '#a1a1aa',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
