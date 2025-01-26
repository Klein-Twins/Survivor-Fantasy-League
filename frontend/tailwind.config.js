/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
        'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      colors: {
        'surface-a5-dark': '#8b8b8b',
        'surface-a4-dark': '#717171',
        'surface-a3-dark': '#575757',
        'surface-a2-dark': '#3f3f3f',
        'surface-a1-dark': '#282828',
        'surface-a0-dark': '#121212',
        'primary-a0-dark': '#3199b4',
        'primary-a1-dark': '#51a4bc',
        'primary-a2-dark': '#6aafc4',
        'primary-a3-dark': '#81bacd',
        'primary-a4-dark': '#97c6d5',
        'primary-a5-dark': '#acd1dd',
      },
    },
  },
  plugins: [],
};

/*

        bg: {
          a0: '#8b8b8b',
          a1: '#717171',
          a2: '#575757',
          a3: '#3f3f3f',
          a4: '#282828',
          a5: '#121212',
          'a0-dark': '#121212',
          'a1-dark': '#282828',
          'a2-dark': '#3f3f3f',
          'a3-dark': '#575757',
          'a4-dark': '#717171',
          'a5-dark': '#8b8b8b',
        },
        text: {
          a0: '#3199b4',
          a1: '#51a4bc',
          a2: '#6aafc4',
          a3: '#81bacd',
          a4: '#97c6d5',
          a5: '#acd1dd',
          'a0-dark': '#3199b4',
          'a1-dark': '#51a4bc',
          'a2-dark': '#6aafc4',
          'a3-dark': '#81bacd',
          'a4-dark': '#97c6d5',
          'a5-dark': '#acd1dd',
        },

        */
