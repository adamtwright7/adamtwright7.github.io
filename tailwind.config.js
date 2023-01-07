/** @type {import('tailwindcss').Config} */
module.exports = {
  // This says check all the html files for classes to turn them into CSS
  content: ['./*.html'], 
  // This helps with build times and allows stuff like w-[70vw]
  mode: 'jit', 
  theme: {
    extend: {
      colors: {
        // Some nice colors from my logo :) 
        copper: '#e7902c',
        offBlack: '#040404',
        brownCopper: '#5e320e',
        whiteCopper: '#e9eee5',
      }
    },  
    // This sets screen sizes and is shorthand for media queries. Ex: “hidden md:flex” means the content is hidden until the screen is at least the size of the pixels specified as “md” (768px in this case)
    screens: { 
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
  plugins: [],
  }
}

// The scripts in package.json allow you to run "npm run build" to start Tailwind, then "npm run watch" to automatically update its CSS output file as HTML classes change. 