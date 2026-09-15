/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Original NexLive palette - deliberately NOT Netflix's
        // exact red (#E50914). A distinct hue + darker, more
        // desaturated background keeps this visually its own
        // brand rather than a reskin.
        nex: {
          bg: '#0A0A0C',
          panel: '#141417',
          panel2: '#1C1C20',
          border: 'rgba(255,255,255,0.08)',
          red: '#C4172C',
          red2: '#9E1223',
          text: '#F2F2F3',
          muted: '#8A8A90'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Inter', 'sans-serif']
      },
      keyframes: {
        'nex-glow': {
          '0%, 100%': { opacity: 0.55 },
          '50%': { opacity: 1 }
        },
        'nex-fade-up': {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        'nex-scale-in': {
          from: { opacity: 0, transform: 'scale(0.92)' },
          to: { opacity: 1, transform: 'scale(1)' }
        }
      },
      animation: {
        'nex-glow': 'nex-glow 2.4s ease-in-out infinite',
        'nex-fade-up': 'nex-fade-up 0.5s ease-out forwards',
        'nex-scale-in': 'nex-scale-in 0.6s cubic-bezier(0.16,1,0.3,1) forwards'
      }
    }
  },
  plugins: []
};
