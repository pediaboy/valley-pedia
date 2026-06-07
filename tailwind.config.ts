import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        galaxy: {
          black: "#080808",
          dark: "#0d0d1a",
          card: "#0f0f1f",
          border: "#1a1a3a",
        },
        neon: {
          blue: "#00c3ff",
          purple: "#8b5cf6",
          cyan: "#06b6d4",
          pink: "#ec4899",
          violet: "#7c3aed",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Orbitron", "sans-serif"],
      },
      backgroundImage: {
        "galaxy-gradient": "radial-gradient(ellipse at center, #0d0d2b 0%, #080808 70%)",
        "neon-gradient": "linear-gradient(135deg, #00c3ff 0%, #8b5cf6 50%, #ec4899 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(15,15,31,0.9) 0%, rgba(13,13,26,0.95) 100%)",
      },
      animation: {
        "star-move": "starMove 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "galaxy-rotate": "galaxyRotate 60s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "progress": "progress 2s ease-in-out forwards",
      },
      keyframes: {
        starMove: {
          "0%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-20px) translateX(10px)" },
          "100%": { transform: "translateY(0px) translateX(0px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 195, 255, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 195, 255, 0.8)" },
        },
        galaxyRotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        progress: {
          "0%": { width: "0%" },
          "100%": { width: "72%" },
        },
      },
      boxShadow: {
        "neon-blue": "0 0 20px rgba(0, 195, 255, 0.4), 0 0 60px rgba(0, 195, 255, 0.1)",
        "neon-purple": "0 0 20px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.1)",
        "neon-cyan": "0 0 20px rgba(6, 182, 212, 0.4), 0 0 60px rgba(6, 182, 212, 0.1)",
        "card": "0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
