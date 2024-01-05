import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          DEFAULT: '#D7B595',
          '50': '#F8F2EC',
          '100': '#EBDBCB',
          '200': '#DFC4AA',
          '300': '#D2AC89',
          '400': '#C69567',
          '500': '#B97E46',
          '600': '#946538',
          '700': '#6F4B2A',
          '800': '#4A321C',
          '900': '#25190E',
        },
        'primary-alt': {
          DEFAULT: '#3E372C',
          '50': '#F4F3F0',
          '100': '#E1DDD5',
          '200': '#CEC7BA',
          '300': '#BBB0A0',
          '400': '#A89A85',
          '500': '#95846A',
          '600': '#776A55',
          '700': '#594F40',
          '800': '#3C352A',
          '900': '#1E1A15',
        },
      },
    },
  },
  plugins: [],
};
export default config;
