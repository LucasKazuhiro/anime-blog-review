/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        'main': '#0F0F0F'
      },
      fontFamily: {
        'lexend': ['Lexend', 'sans-serif'],
        'staatliches': ['Staatliches', 'sans-serif'],
        'facultyGlyphic': ['Faculty Glyphic', 'sans-serif']
      }
    },
  },
  plugins: [],
}

