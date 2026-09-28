import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: "#0B5D4B", dark: "#084839", soft: "#E6F1EE" }, sun: "#F2B705" },
      fontFamily: { sans: ["var(--font-jakarta)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
