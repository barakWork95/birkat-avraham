/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Gold & Royalty theme
        gold: {
          DEFAULT: '#B8860B',
          light: '#D4AF37',
          soft: '#E9D9A6',
          hover: '#966d07',
        },
        ink: {
          DEFAULT: '#1A1110', // deep warm dark brown
          soft: '#2B1B17',
          muted: '#5c4a44',
        },
        cream: '#FDFBF7', // soft pearl background
      },
      fontFamily: {
        // Clean, modern, sharp heading font (Heebo) — resolves via the --font-heading CSS var
        heading: ['var(--font-heading)'],
        // Modern, highly legible body & UI font (Assistant) — resolves via --font-family
        body: ['var(--font-family)'],
      },
      boxShadow: {
        card: '0 4px 24px -8px rgba(26, 17, 16, 0.12)',
        'card-hover': '0 12px 40px -10px rgba(26, 17, 16, 0.22)',
        gold: '0 8px 30px -8px rgba(184, 134, 11, 0.45)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.8s ease-out both',
        'scale-in': 'scale-in 0.3s ease-out both',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
}
