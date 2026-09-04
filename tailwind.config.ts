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
          DEFAULT: '#0B1D35',
          50:  '#EAEEF4',
          100: '#CDD8E6',
          200: '#9BB0CC',
          300: '#6989B3',
          400: '#385F92',
          500: '#0B1D35',
          600: '#091729',
          700: '#07162A',
          800: '#050F1C',
          900: '#030810',
          950: '#07162A',
        },
        brand: {
          DEFAULT: '#D62C35',
          50:  '#FDECEC',
          100: '#FBD2D3',
          200: '#F6A8AB',
          300: '#EF7C80',
          400: '#E4525A',
          500: '#D62C35',
          600: '#B22029',
          700: '#8C1920',
          800: '#5C1015',
          900: '#2E080A',
        },
        accent: {
          DEFAULT: '#D62C35',
          50:  '#FDECEC',
          100: '#FBD2D3',
          200: '#F6A8AB',
          300: '#EF7C80',
          400: '#E4525A',
          500: '#D62C35',
          600: '#B22029',
          700: '#8C1920',
          800: '#5C1015',
          900: '#2E080A',
        },
        secondary: {
          DEFAULT: '#0EA5A8',
          50:  '#E6FFFB',
          100: '#BFF8F3',
          200: '#8DEDE8',
          300: '#5CE0DC',
          400: '#2DCAC8',
          500: '#0EA5A8',
          600: '#0B8589',
          700: '#08666A',
          800: '#05484B',
          900: '#032A2D',
        },
        dark: {
          DEFAULT: '#111827',
          50:  '#F3F4F6',
          100: '#E5E7EB',
          200: '#D1D5DB',
          300: '#6B7280',
          400: '#4B5563',
          500: '#111827',
          600: '#0F172A',
          700: '#0B1120',
          800: '#060B15',
          900: '#020617',
        },
        light: {
          DEFAULT: '#F8FAFC',
          200: '#F6F8FB',
          300: '#E8EEF6',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient':  'linear-gradient(135deg, #07162A 0%, #0B1D35 60%, #0B1D35 100%)',
        'card-gradient':  'linear-gradient(180deg, rgba(11,29,53,0.04) 0%, rgba(214,44,53,0.04) 100%)',
        'brand-gradient': 'linear-gradient(135deg, #0B1D35 0%, #D62C35 100%)',
      },
      boxShadow: {
        // Named "btn"/"btn-hover" rather than "accent"/"accent-hover": Tailwind auto-generates a
        // `shadow-{colorName}` utility for every theme color (opaque, no alpha) — since a color
        // named "accent" also exists, a boxShadow key of the same name collides with it and the
        // auto-generated one wins the cascade, silently stripping the alpha from this shadow.
        'btn':          '0 2px 6px rgba(214, 44, 53, 0.18)',
        'btn-hover':     '0 6px 14px rgba(214, 44, 53, 0.24)',
        'primary':      '0 12px 30px rgba(11, 29, 53, 0.16)',
        'brand':        '0 4px 10px rgba(214, 44, 53, 0.16)',
        'card':         '0 8px 28px rgba(15, 23, 42, 0.08)',
        'card-hover':   '0 18px 42px rgba(15, 23, 42, 0.14)',
      },
    },
  },
  plugins: [],
};

export default config;
