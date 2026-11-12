import type { Config } from "tailwindcss";

/**
 * JosStay design tokens.
 * Colours are exact per the brand guidelines; type sizes follow the brand table.
 * Spacing uses Tailwind's 4px base, which maps cleanly onto the 8pt grid
 * (2, 3, 4, 6, 8, 12, 16, 24 units = 8, 12, 16, 24, 32, 48, 64, 96 px).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: "#173B4D",
        sage: {
          DEFAULT: "#7F9C8D",
          soft: "#DCE7E0",
          deep: "#3F6B58",
        },
        ivory: "#F7F4ED",
        sand: "#E9DFCF",
        gold: "#B99A62",
        charcoal: "#283238",
        surface: "#FFFFFF",
        error: "#B42318",
        success: "#3F6B58",
        warning: "#8A6118",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        serif: [
          "var(--font-fraunces)",
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
      },
      fontSize: {
        h1: [
          "clamp(2.5rem, 4vw, 3rem)",
          { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "600" },
        ],
        h2: [
          "clamp(1.75rem, 2.5vw, 2rem)",
          { lineHeight: "1.18", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        h3: [
          "clamp(1.25rem, 1.6vw, 1.5rem)",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        hotel: [
          "clamp(1.125rem, 1.5vw, 1.375rem)",
          { lineHeight: "1.3", letterSpacing: "-0.01em" },
        ],
        body: ["1rem", { lineHeight: "1.6" }],
        secondary: ["0.875rem", { lineHeight: "1.5" }],
        metadata: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],
        button: ["0.9375rem", { lineHeight: "1.25", fontWeight: "600" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(23, 59, 77, 0.05), 0 1px 3px rgba(23, 59, 77, 0.04)",
        medium:
          "0 6px 16px -4px rgba(23, 59, 77, 0.10), 0 2px 6px -2px rgba(23, 59, 77, 0.05)",
        large:
          "0 24px 56px -16px rgba(23, 59, 77, 0.20), 0 6px 16px -6px rgba(23, 59, 77, 0.08)",
        focus: "0 0 0 4px rgba(23, 59, 77, 0.12)",
      },
      screens: {
        tablet: "768px",
        desktop: "1280px",
        wide: "1440px",
      },
      maxWidth: {
        content: "1200px",
        prose: "68ch",
      },
      transitionTimingFunction: {
        calm: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 1.8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
