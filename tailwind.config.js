/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        surface: 'rgba(255,255,255,0.025)',
        line: 'rgba(255,255,255,0.07)',
        ink: {
          DEFAULT: 'rgba(255,255,255,0.85)',
          dim: 'rgba(255,255,255,0.4)',
          mute: 'rgba(255,255,255,0.18)',
          ghost: 'rgba(255,255,255,0.1)',
        },
        ring: {
          life: 'rgba(255,255,255,0.75)',
          habits: 'rgba(255,255,255,0.5)',
          work: 'rgba(255,255,255,0.28)',
        },
      },
      fontFamily: {
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Instrument Serif"', 'ui-serif', 'serif'],
        sans: ['"Outfit"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        dots: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)',
      },
      backgroundSize: {
        dots: '9px 9px',
      },
      letterSpacing: {
        widish: '0.06em',
        wider2: '0.14em',
      },
    },
  },
  plugins: [],
};
