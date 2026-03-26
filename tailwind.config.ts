import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tbo: {
          orange: {
            50: "#fff4ec",
            100: "#ffe5cc",
            200: "#ffc999",
            300: "#ffad66",
            400: "#ff9133",
            500: "#ff6200", // TBO primary orange
            600: "#cc4e00",
            700: "#993b00",
            800: "#662700",
            900: "#331400",
            950: "#1a0a00",
            DEFAULT: "#ff6200",
          },
          black: "#0a0a0a",
          white: "#fafafa",
          // ── TBO Academy Design System ──────────────────────────
          academy: {
            forest: "#02261C", // 1 — verde floresta profundo (background escuro)
            green: "#2E5902", // 2 — verde médio
            lime: "#BAF241", // 3 — verde limão neon (accent primário)
            black: "#000000", // 4 — preto
            offwhite: "#F2F2F2", // 5 — branco suave
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
