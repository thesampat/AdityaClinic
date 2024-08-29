module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e5e7eb',
          100: '#6f40ed',
          200: '#3f56eb',
          300: '#1d1c44',
          400: '#0f172a',
          500: "#8CB1F3"
        },
        secondry: {

          300: "#6A7280",
          400: "#1F2937",
        }
      },
    },
  },
  plugins: [],
};
