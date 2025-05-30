/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         colors: {
            'background': '#fafafa',
            'primary': '#4F46E5',  // More vibrant indigo
            'secondary': '#EC4899', // Vibrant pink
            'primarydark': '#3730A3', // Darker indigo
            'primarylight': '#E0E7FF', // Light indigo
            'accent-1': '#F59E0B', // Warm amber
            'accent-2': '#10B981', // Fresh emerald
            'accent-3': '#8B5CF6', // Rich purple
            'gray-custom': '#6B7280',
         },
         boxShadow: {
           'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
           'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
         },
         animation: {
           'gradient': 'gradient 8s linear infinite',
         },
         keyframes: {
           gradient: {
             '0%, 100%': {
               'background-size': '200% 200%',
               'background-position': 'left center'
             },
             '50%': {
               'background-size': '200% 200%',
               'background-position': 'right center'
             },
           },
         },
      },
   },
   plugins: [],
};
