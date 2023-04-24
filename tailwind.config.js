module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./public/**/*.html",
    ],
    purge: ['./src/**/*.{js,ts,jsx,tsx}'],
    darkMode: false,
    theme: {
      extend: {
        gridTemplateColumns: {
          sidebar: "300px auto", // 👈 for sidebar layout. adds grid-cols-sidebar class
        }, 
        gridTemplateRows: {
          header: "64px auto", // 👈 for the navbar layout. adds grid-rows-header class
        },

        colors: {
          'cougar-red': '#c8102e',
          'cougar-dark-red': '#960c22',
          'cougar-dark-red2':'#7c081a',
          'bright-white': '#ffffff',
          'hover-white': '#eaeded',
          'hover-white2': '#e7e7e7',
          'hover-white3': '#7f7e83',
          'friendly-black': '#121212',
          'friendly-grey': '#f2f2f2',
          'friendly-black2': '#919191',
          'friendly-black3': '#222222',
          'friendly-black4': '#333333',
          'cougar-yellow': '#fff9d9',
          'cougar-gold': '#f1a943',
          'cougar-gold-dark':'#D5963D',
          'cougar-dark-red3':'#700919',
          'cougar-teal':'#05b48c',
          'cougar-dark-teal':'#1ca277',
        },

      },
    },
    variants: {
      extend: {},
    },
    plugins: [
      require("flowbite/plugin")

    ],


  }

  