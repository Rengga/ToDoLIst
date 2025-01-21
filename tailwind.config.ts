import type { Config } from "tailwindcss";

export default {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cusDark: "#222831",
        cusGrey: "#4B5360",
        cusRed: "#F05454",
        cusBlue: "#31A2FF",
        cusGreen: "#1CCF6D",
      },
    },
  },
  plugins: [],
} satisfies Config;
