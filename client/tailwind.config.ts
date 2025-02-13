/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}', // Si vous avez des pages ailleurs
    ],
    darkMode: 'class',
    theme: {
        extend: {},
    },
    plugins: [require('daisyui')],
};
