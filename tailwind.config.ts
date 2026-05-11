import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0052CC',
          50: '#E6EEFF',
          100: '#C0D4FF',
          200: '#85ACFF',
          300: '#4A84FF',
          400: '#1A60FF',
          500: '#0052CC',
          600: '#0040A0',
          700: '#003080',
          800: '#002060',
          900: '#001040',
        },
        secondary: {
          DEFAULT: '#00C8E0',
          50: '#E0FAFD',
          100: '#B3F2F9',
          200: '#66E5F2',
          300: '#1AD8EC',
          400: '#00C8E0',
          500: '#00A0B4',
          600: '#007A8A',
          700: '#005A66',
          800: '#003C44',
          900: '#001E22',
        },
        accent: {
          DEFAULT: '#FF6200',
          50: '#FFF0E6',
          100: '#FFD4B3',
          200: '#FFB380',
          300: '#FF924D',
          400: '#FF711A',
          500: '#FF6200',
          600: '#CC4E00',
          700: '#993B00',
          800: '#662800',
          900: '#331400',
        },
        dark: {
          DEFAULT: '#0A0E1A',
          50: '#E8E9EC',
          100: '#C5C7CF',
          200: '#8F93A5',
          300: '#595F7B',
          400: '#353B57',
          500: '#0A0E1A',
          600: '#080B14',
          700: '#06080F',
          800: '#04060A',
          900: '#020305',
        },
        light: {
          DEFAULT: '#F4F9FF',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#F4F9FF',
          300: '#DCECff',
          400: '#C4DFFF',
          500: '#ABD2FF',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0052CC 0%, #00C8E0 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(0,82,204,0.05) 0%, rgba(0,200,224,0.05) 100%)',
      },
      boxShadow: {
        'accent': '0 4px 24px rgba(255, 98, 0, 0.35)',
        'primary': '0 4px 24px rgba(0, 82, 204, 0.25)',
        'card': '0 2px 16px rgba(10, 14, 26, 0.08)',
        'card-hover': '0 8px 32px rgba(10, 14, 26, 0.14)',
      },
    },
  },
  plugins: [],
};

export default config;
