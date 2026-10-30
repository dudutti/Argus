/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pure neutral Carbon/Zinc grayscale (Zero blue-slate tint)
        slate: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
        },
        // Remap cyan -> Brushed Warm Titanium / Champagne Amber (#D4A359)
        cyan: {
          50: '#FBF8F3',
          100: '#F5EFE4',
          200: '#EADBC2',
          300: '#DFC496',
          400: '#D4A359',
          500: '#B8863B',
          600: '#966A2B',
          700: '#755022',
          800: '#5A3E1D',
          900: '#422E17',
        },
        // Remap sky -> Anodized Slate Steel (#7C93A8)
        sky: {
          300: '#A3B6C7',
          400: '#7C93A8',
          500: '#5E768C',
          600: '#475B6D',
        },
        // Remap emerald -> Tactical Sage / Oxidized Phosphor (#4E9F76)
        emerald: {
          200: '#B2DEC8',
          300: '#7BC49F',
          400: '#4E9F76',
          500: '#3B825E',
          600: '#2B6347',
        },
        // Remap rose -> Signal Vermilion / International Orange (#E04F33)
        rose: {
          200: '#F7C1B6',
          300: '#EE8B77',
          400: '#E04F33',
          500: '#C43C22',
          600: '#9E2E18',
        },
        // Remap fuchsia -> Muted Mauve / Ultraviolet Quartz (#9D7CD8)
        fuchsia: {
          200: '#DCD0F2',
          300: '#BEA8E6',
          400: '#9D7CD8',
          500: '#7E5BB8',
          600: '#614394',
        },
        // Remap amber -> Raw Brass / Ochre (#C99A49)
        amber: {
          200: '#EFE0C2',
          300: '#DFC18B',
          400: '#C99A49',
          500: '#A87C31',
        },
        aether: {
          bg: '#08090C',
          panel: '#0E1014',
          border: 'rgba(255, 255, 255, 0.07)',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
