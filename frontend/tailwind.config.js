module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#041C32',
          800: '#04293A',
          700: '#064663',
          600: '#0A5C7A',
          500: '#0E7490',
          400: '#20A4B0', // lighter for borders
          300: '#45C1D4', // lighter for placeholder text
          200: '#A0E1F0', // very light text
          100: '#D0F0FA', // optional background highlights
        },
        accent: {
          500: '#ECB365',
          400: '#F1C27D',
          300: '#F6D59A',
        },
        neutral: {
          white: '#FFFFFF',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
          },
        },
      },
      boxShadow: {
        'inner-glow': 'inset 0 0 8px rgba(236, 179, 101, 0.3)',
        'float-md': '0 6px 20px rgba(0, 0, 0, 0.15)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(25px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatLabel: {
          '0%': { transform: 'translateY(0)', fontSize: '1rem' },
          '100%': { transform: 'translateY(-1.5rem)', fontSize: '0.75rem' },
        },
        gradientBorder: {
          '0%': { borderColor: '#ECB365' },
          '50%': { borderColor: '#FFB76B' },
          '100%': { borderColor: '#ECB365' },
        },
        fontFamily: {
          sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
        },
      },
      animation: {
        fadeUp: 'fadeUp 1s ease-out forwards',
        floatLabel: 'floatLabel 0.3s ease forwards',
        gradientBorder: 'gradientBorder 3s ease infinite',
      },
    },
  },
  plugins: [],
};
