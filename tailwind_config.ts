import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: "#000000",
        surface: "#1e1e1e",
        card: "#1e1e1e",
        line: "var(--line)",
        accent: "#2fd071",
        accent2: "#4aa3ff",
        ink: "var(--ink)",
        muted: "var(--muted)",
        brand: "var(--brand)"
      },
      fontFamily: { sans: ["Figtree", "-apple-system", "BlinkMacSystemFont", "Inter", "system-ui", "sans-serif"] },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
        rise: "rise .45s cubic-bezier(.16,1,.3,1) both"
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        rise: { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "translateY(0)" } }
      }
    }
  },
  plugins: []
};
export default config;
