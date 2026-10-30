/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F5F5F7',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1D1D1F',
        },
        primary: {
          DEFAULT: '#007AFF',
          hover: '#0062CC',
          foreground: '#FFFFFF',
          subtle: '#EBF4FF',
        },
        secondary: {
          DEFAULT: '#86868B',
          foreground: '#1D1D1F',
        },
        border: '#E5E5EA',
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F5F5F7',
          subtle: '#FBFBFD',
        },
        text: {
          primary: '#1D1D1F',
          secondary: '#86868B',
          muted: '#A1A1A6',
        },
        status: {
          success: '#34C759',
          warning: '#FF9F0A',
          danger: '#FF3B30',
          info: '#007AFF',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        apple: '0 2px 10px rgba(0, 0, 0, 0.04)',
        'apple-md': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 12px 32px rgba(0, 0, 0, 0.08)',
        subtle: '0 1px 3px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        apple: '14px',
        'apple-sm': '10px',
        'apple-lg': '20px',
      },
    },
  },
  plugins: [],
};
