/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '981px',
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {
      colors: {
        'ct-primary': '#2d5016',
        'ct-primary-hover': '#3b651d',
        'ct-bg': '#f3eee5',
        'ct-bg-alt': '#e8e0cf',
        'ct-surface': '#fffdf8',
        'ct-text-primary': '#182b0e',
        'ct-text-muted': '#77846d',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Lora', 'serif'],
        sans: ['DM Sans', 'Nunito', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
