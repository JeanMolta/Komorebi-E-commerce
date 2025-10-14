export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx,html}"],
  theme: { extend: { fontFamily: {
      jost: ['Jost', 'sans-serif'],
      sf: ['SF Pro Display', 'sans-serif'],
      simonetta: ['Simonetta', 'serif'],
    },
    colors: {
      komorebi: {
        black: '#282828',
        gray: '#D9D9D9',
        yellow: '#F9B81F',
        offwhite: '#F9F8F5',
      },
    },
  },
  plugins: [],
}
}
