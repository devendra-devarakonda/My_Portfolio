/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#050B17',
        'bg-secondary': '#0A1128',
        'bg-card': 'rgba(255, 255, 255, 0.04)',
        'bg-card-hover': 'rgba(255, 255, 255, 0.08)',
        'glass-bg': 'rgba(255, 255, 255, 0.03)',
        'glass-border': 'rgba(255, 255, 255, 0.08)',
        'accent': '#FF2B4D',
        'accent-secondary': '#FF4D6D',
        'accent-dark': '#CC2240',
        'accent-glow': 'rgba(255, 43, 77, 0.4)',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0',
        'text-muted': 'rgba(255, 255, 255, 0.4)',
        'border-subtle': 'rgba(255, 255, 255, 0.08)',
        'border-red': 'rgba(255, 43, 77, 0.3)',
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 15s linear infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        typing: 'typing 3.5s steps(40, end)',
        blink: 'blink 0.75s step-end infinite',
        'slide-up': 'slideUp 0.6s ease forwards',
        'slide-left': 'slideLeft 0.8s ease forwards',
        'fade-in': 'fadeIn 1s ease forwards',
        'scale-in': 'scaleIn 0.5s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-ring': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        glow: {
          from: { boxShadow: '0 0 10px rgba(255, 43, 77, 0.2), 0 0 20px rgba(255, 43, 77, 0.1)' },
          to: { boxShadow: '0 0 20px rgba(255, 43, 77, 0.4), 0 0 40px rgba(255, 43, 77, 0.2)' },
        },
        typing: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        blink: {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: '#FF2B4D' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          from: { opacity: '0', transform: 'translateX(-40px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        progressFill: {
          from: { width: '0%' },
        },
        shimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(255, 43, 77, 0.2)' },
          '50%': { borderColor: 'rgba(255, 43, 77, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
