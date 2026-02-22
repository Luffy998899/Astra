export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070b12",
          900: "#0b1220",
          800: "#111b2e",
          700: "#18233b",
          600: "#23314d"
        },
        neon: {
          500: "#3b82f6",
          400: "#60a5fa",
          300: "#93c5fd"
        },
        aurora: {
          500: "#10b981",
          400: "#34d399",
          300: "#6ee7b7"
        },
        ember: {
          500: "#f97316",
          400: "#fb923c",
          300: "#fdba74"
        }
      },
      fontFamily: {
        sans: ["Space Grotesk", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular"]
      },
      boxShadow: {
        glow: "0 0 30px rgba(59, 130, 246, 0.35)",
        soft: "0 12px 40px rgba(7, 11, 18, 0.35)"
      },
      backgroundImage: {
        "radial-ink": "radial-gradient(circle at top, rgba(59,130,246,0.12), transparent 55%)",
        "radial-aurora": "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.18), transparent 45%)",
        "radial-ember": "radial-gradient(circle at 80% 0%, rgba(249,115,22,0.18), transparent 40%)"
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(18px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out forwards"
      }
    }
  },
  plugins: []
}
