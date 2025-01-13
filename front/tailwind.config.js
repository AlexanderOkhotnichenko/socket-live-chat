/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    screens: {
      xl: { max: '1499.99px' },
      lg: { max: '1199.99px' },
      md: { max: '875.99px' },
      sm: { max: '767.99px' },
      xs: { max: '474.99px' },
      ls: { max: '389.99px' },
    },
    container: {
      center: true,
      padding: '15px'
    },
    extend: {
      width: {
        "90vw": "90vw",
        "1/10": "10%",
        "11": "44px",
      },
      height: {
        "90vh": "90vh",
        "1/10": "10%",
        "11": "44px",
      },
      maxWidth: {
        450: "450px"
      },
      borderColor: {
        "container": "rgba(255, 255, 255, 0.125)",
      },
      borderRadius: {
        "50%": "50%"
      },
      backgroundPosition: {
        "top-right": "top right"
      },
      backgroundColor: {
        "container": "rgba(17, 25, 40, 0.75)",
        "white-0.15": "rgba(255, 255, 255, 0.15)",
        "gray-white": "rgb(240, 244, 250)",
      },
      colors: {
        body: '#00040F',
        "blue-custome": '#206fee',
        "primary-background": "var(--primary-background)",
        "background-blue": "var(--background-blue)",
        "primary-text-color": "var(--primary-text-color)",
        "primary-border-color": "var(--primary-border-color)",
        "hover-primary-text-color": "var(--hover-primary-text-color)",
      },
      fontFamily: {
        'ArialRoundedMTBold': 'Arial Rounded MT Bold',
      },
      flex: {
        "full": "1 1 100%",
      },
      boxShadow: {
        "right": '0 0 0.25rem rgba(0, 0, 0, 0.25)',
        "stars-before": "rgb(227, 227, 199) -12px 0 0 -3px, rgb(227, 227, 199) -8px 13px 0 -2px"
      },
      background: {
        
      },
      transformOrigin: {
        'stars': "-6px 130%"
      },
      keyframes: {
        'fade-in': {
          from: {
            opacity: 0
          },
          to: {
            opacity: 1
          },
        },
        stars: {
          '50%': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: `
              #fff 12px -3px 0 0, 
              #fff 6px 4px 0 -1px, 
              rgba(255, 255, 255, 0.1) 18px 8px 0 0px, 
              #fff 13px 17px 0 0, 
              rgba(255, 255, 255, 0.1) 11px 10px 0 -1px, 
              #fff 2px 19px 0 -1px`,
          },
        },
      },
      animation: {
        fakeIn: 'fade-in .3s ease',
        stars: 'stars 5s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}

