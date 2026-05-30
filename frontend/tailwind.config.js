/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          black:  '#020409',
          dark:   '#060b14',
          navy:   '#0a1628',
          blue:   '#0d1f3c',
          cyan:   '#00ff88',
          neon:   '#00aaff',
          purple: '#7c3aed',
          violet: '#a855f7',
          red:    '#ff3333',
          orange: '#ff6600',
          amber:  '#ffcc00',
          gray:   '#8bb4e7',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        mono:     ['JetBrains Mono', 'Courier New', 'monospace'],
        inter:    ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(rgba(0,170,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,170,255,0.03) 1px,transparent 1px)",
        'neon-cyan':  'linear-gradient(135deg,#00ff88,#00aaff)',
        'neon-purple':'linear-gradient(135deg,#7c3aed,#00aaff)',
        'neon-red':   'linear-gradient(135deg,#ff3333,#ff6600)',
      },
      animation: {
        'scan':        'scanLine 3s linear infinite',
        'pulse-neon':  'pulseNeon 2s ease-in-out infinite',
        'pulse-red':   'pulseRed 1.5s ease-in-out infinite',
        'spin-slow':   'spin 8s linear infinite',
        'float':       'float 6s ease-in-out infinite',
        'glow':        'glow 2s ease-in-out infinite',
        'typewriter':  'typewriter 0.05s steps(1) infinite',
        'blink':       'blink 1s step-end infinite',
        'matrix':      'matrix 20s linear infinite',
        'hex-rotate':  'hexRotate 12s linear infinite',
        'fade-in-up':  'fadeInUp 0.6s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'threat-blink':'threatBlink 0.8s ease-in-out infinite',
      },
      keyframes: {
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        pulseNeon: {
          '0%,100%': { boxShadow: '0 0 5px #00ff88, 0 0 20px rgba(0,255,136,.3)' },
          '50%':     { boxShadow: '0 0 20px #00ff88, 0 0 60px rgba(0,255,136,.6)' },
        },
        pulseRed: {
          '0%,100%': { boxShadow: '0 0 5px #ff3333, 0 0 20px rgba(255,51,51,.3)' },
          '50%':     { boxShadow: '0 0 20px #ff3333, 0 0 60px rgba(255,51,51,.6)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%,100%': { opacity: 0.8 },
          '50%':     { opacity: 1 },
        },
        blink: {
          '0%,100%': { opacity: 1 },
          '50%':     { opacity: 0 },
        },
        hexRotate: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fadeInUp: {
          '0%':   { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideRight: {
          '0%':   { opacity: 0, transform: 'translateX(-20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        threatBlink: {
          '0%,100%': { opacity: 1, color: '#ff3333' },
          '50%':     { opacity: 0.4, color: '#ff6600' },
        },
      },
      boxShadow: {
        'neon-cyan':   '0 0 20px rgba(0,255,136,.4), 0 0 60px rgba(0,255,136,.2)',
        'neon-blue':   '0 0 20px rgba(0,170,255,.4), 0 0 60px rgba(0,170,255,.2)',
        'neon-purple': '0 0 20px rgba(124,58,237,.4), 0 0 60px rgba(124,58,237,.2)',
        'neon-red':    '0 0 20px rgba(255,51,51,.5), 0 0 60px rgba(255,51,51,.3)',
        'glass':       '0 8px 32px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.05)',
      },
    },
  },
  plugins: [],
}
