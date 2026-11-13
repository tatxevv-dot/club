import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: "#05070d",
        surface: "#0b1018",
        card: "#101725",
        line: "#1d2637",
        accent: "#22d3ee",
        accent2: "#a3e635"
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
        rise: "rise .45s cubic-bezier(.16,1,.3,1)"
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        rise: { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } }
      }
    }
  },
  plugins: []
};
export default config;
