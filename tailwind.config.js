/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // enable manual dark mode
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx,scss}", // include SCSS files
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
