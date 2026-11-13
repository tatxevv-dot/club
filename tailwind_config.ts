import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: "#0a0a0b",
        surface: "#141416",
        card: "#141416",
        line: "rgba(255,255,255,0.08)",
        accent: "#00c46f",
        accent2: "#0a84ff",
        ink: "#f5f5f7",
        muted: "#8e8e93",
        brand: "#00c46f",
        brand2: "#00985f",
        s1: "#141416",
        s2: "#1c1c1f",
        s3: "#2a2a2e"
      },
      fontFamily: { sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Inter", "system-ui", "sans-serif"] },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
        rise: "rise .5s cubic-bezier(.16,1,.3,1) both"
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        rise: { "0%": { opacity: "0", transform: "translateY(14px) scale(.985)" }, "100%": { opacity: "1", transform: "translateY(0) scale(1)" } }
      }
    }
  },
  plugins: []
};
export default config;
