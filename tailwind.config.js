/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './App.{js,jsx,ts,tsx}',
        './src/**/**/*.{js,jsx,ts,tsx}',
        // "./src/components/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                'solar-blue-dark': '#0d3b85',
                'solar-blue-light': '#1a9cd9',
                'solar-green-light': '#A7C414',
                'solar-yellow-dark': '#F99F1E',
                'solar-yellow-light': '#FFD100',
                'solar-gray-dark': '#F1F1F1',
                'solar-gray-middle': '#F8F8F8',
                'solar-gray-light': '#FAFAFA',
                'solar-orange-middle': '#F99F1E',
                'solar-orange-dark': '#EC6608',
            },
            fontFamily: {
                PoppinsLight: ['Poppins_300Light'],
                PoppinsRegular: ['Poppins_400Regular'],
                PoppinsMedium: ['Poppins_500Medium'],
                PoppinsBold: ['Poppins_700Bold'],
                PoppinsBlack: ['Poppins_900Black'],
            },
        },
    },
    plugins: [],
};
