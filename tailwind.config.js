/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eff6ff',
          600: '#2563eb',
        },
        slate: {
          50: '#f8fafc',
          900: '#0f172a',
        }
      },
    },
  },
  plugins: [],
}