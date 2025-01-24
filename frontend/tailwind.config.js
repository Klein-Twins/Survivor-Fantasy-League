export const content = [
  './index.html',
  './src/**/*.{js,jsx,ts,tsx}', // Adjust this path as needed
];
export const theme = {
  extend: {
    backgroundImage: {
      'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
      'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
    },
    colors: {
      background: {
        base: '#080808', // Main background color
        dp01: '#121212',
        dp02: '#1c1c1c',
        dp03: '#262626',
        dp04: '#2f2f2f',
      },
      error: {
        light: '#FFEBEE', // Light background
        main: '#F44336', // Primary error
        dark: '#C62828', // Dark/hover state
        text: '#D32F2F', // Error text
        bg: '#FDE7E9', // Error background
      },
      text: {
        primary: '#f4f4f4', // Highest contrast for main content
        secondary: '#e0e0e0', // Clear but less prominent
        tertiary: '#cccccc', // Subtle text, still readable
        link: {
          default: '#82B1FF', // Brighter blue for dark theme
          hover: '#448AFF', // More saturated on hover
          visited: '#B388FF', // Purple tint for visited
        },
        emphasis: '#FFFFFF', // Pure white for maximum contrast
        muted: 'rgba(255, 255, 255, 0.20)', // Background text, hints
        success: '#69F0AE', // Bright green for success
        warning: '#FFD740', // Bright amber for warnings
        error: '#FF5252', // Bright red for errors
      },
      button: {
        primary: {
          base: '#1976D2', // Default state
          hover: '#1565C0', // Hover state
          active: '#0D47A1', // Active/pressed state
          disabled: '#90CAF9', // Disabled state
          text: '#FFFFFF', // Button text
        },
        secondary: {
          base: '#424242', // Default state
          hover: '#303030', // Hover state
          active: '#212121', // Active/pressed state
          disabled: '#757575', // Disabled state
          text: '#FFFFFF', // Button text
        },
      },
    },
    fontSize: {
      display: ['4rem', { lineHeight: '1.2' }], // 64px
      header: ['2rem', { lineHeight: '1.2' }], // 40px
      title: ['1.5rem', { lineHeight: '1.2' }], // 32px
      subtitle: ['1.25rem', { lineHeight: '1.4' }], // 24px
      body: ['0.875rem', { lineHeight: '1.5' }], // 18px
      caption: ['0.875rem', { lineHeight: '1.4' }], // 14px
    },
  },
};
export const plugins = [];
