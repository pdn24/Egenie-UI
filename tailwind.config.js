const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
  flowbite.content(),
];
export const theme = {
  extend: {},
};
export const  plugins= [flowbite.plugin()]

