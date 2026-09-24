import type { Config } from "tailwindcss";

// Color palette estimated from the attached Divyamrut packaging and Precious Ayurveda logo.
// ivory/cream background + deep forest green + soft natural green + warm bronze accent,
// with a muted plum pulled from the Precious logo used only as a rare secondary accent.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F6EFDD",
          light: "#FBF7EC",
          dark: "#EDE2C6",
        },
        forest: {
          DEFAULT: "#1F4B34",
          dark: "#123321",
          light: "#2E6448",
        },
        sage: {
          DEFAULT: "#6E8F6C",
          light: "#9CB79A",
        },
        bronze: {
          DEFAULT: "#B08A4E",
          light: "#D3B67F",
        },
        charcoal: "#26241F",
        plum: "#7A2A5E",
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 30px rgba(31, 75, 52, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
