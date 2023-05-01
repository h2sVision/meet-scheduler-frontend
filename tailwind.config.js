/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./common/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'white':'#fff',
      'black':'#000',
      'purple':'#000A86',
      'gray': '#747474',
      'light-gray':'#F9F9F9',
      'dark-gray':'#F2F2F2',
      'border-gray':'#E3E3E3',
      'faint-blue':'#F3F4FB',
      'blue':'#000DB7',
      'google-blue':'#0066FF',
      'card-blue':'#CFE2FF',
      'dark-blue':'#1E3354',
      'red-300':'#fca5a5',
      'red-500': 'rgb(239 68 68)',
      'green-500': 'rgb(34 197 94)',
      'red-100': 'rgb(254 226 226)',
      'green-100': 'rgb(220 252 231)',
    },
  },
  plugins: [],
}
