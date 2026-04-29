module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          900: '#881337',
        },
        secondary: "#475569",
        accent: "#f59e0b",
        dark: "#0f172a",
        light: "#f8fafc",
        card: "#ffffff",
        border: "#e2e8f0"
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        md: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)"
      }
    },
  },
  plugins: [],
}
