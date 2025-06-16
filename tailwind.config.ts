import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        
        background: "hsl(var(--background))",
        
        border: "hsl(var(--border))",
        
        button: {
          border: "hsl(var(--button-border))",
        },

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        
        customPurple: "#8c8bf1",
        customDarkGray: "#2d2d2d",
        customMediumGray: "#4d4d4d",
        
        footer: {
          DEFAULT: "hsl(var(--footer))",
        },
        
        foreground: "hsl(var(--foreground))",

        golden: "hsl(var(--golden))",
        
        input: "hsl(var(--input))",
        
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        
        navbar: {
          DEFAULT: "hsl(var(--navbar))",
          foreground: "hsl(var(--navbar-foreground))",
          border: "hsl(var(--navbar-border))",
        },
        
        placeholder: {
          DEFAULT: "hsl(var(--placeholder))",
        },

        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
          border: "hsl(var(--popover-border))",
        },
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        
        ring: "hsl(var(--ring))",
        
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config;
