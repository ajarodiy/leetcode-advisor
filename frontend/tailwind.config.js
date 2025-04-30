/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                yellow: {
                    400: '#FFD600',
                    500: '#FFC107',
                },
                gray: {
                    700: '#2D2D2D',
                    800: '#1E1E1E',
                    900: '#0F0F0F',
                },
                black: '#050505',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'custom': '0 4px 12px rgba(0, 0, 0, 0.25)',
            },
        },
    },
    plugins: [],
};