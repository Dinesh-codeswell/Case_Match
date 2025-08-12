import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // New custom colors
        "new-primary": "hsl(200 92% 64%)", // #4ebbf8
        "new-background": "hsl(150 65% 7%)", // #052012
        "new-accent": "hsl(75 60% 62%)", // #C2db62
        "new-planetary": "hsl(229 54% 44%)", // #334EAC
        "new-venus": "hsl(209 50% 88%)", // #BAD6EB
        "new-universe": "hsl(218 50% 63%)", // #7096D1
        "new-metro": "hsl(36 50% 95%)", // #F7F2EB
        "new-milky-way": "hsl(36 100% 98%)", // #fff9F0
        "new-galaxy": "hsl(228 88% 20%)", // #081F5c
        "new-sky": "hsl(216 100% 91%)", // #D0E3FF
        "new-amber": "hsl(40 84% 70%)", // Custom amber for badges
        "new-red-orange": "hsl(7 78% 70%)", // Custom red-orange for badges
        "new-purple-gray": "hsl(250 18% 60%)", // Custom purple-gray for badges
        "footer-background-orange": "#FE7D6A", // New color from screenshot
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-secondary": "var(--gradient-secondary)",
        "gradient-hero": "var(--gradient-hero)",
        "gradient-accent": "var(--gradient-accent)",
      },
      boxShadow: {
        elegant: "var(--shadow-elegant)",
        glow: "var(--shadow-glow)",
        soft: "var(--shadow-soft)",
        glass: "var(--glass-shadow)",
        "glass-hover": "var(--glass-shadow-hover)",
      },
      backdropBlur: {
        glass: "var(--backdrop-blur)",
        "glass-strong": "var(--backdrop-blur-strong)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--primary) / 0.6)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "glass-blur": {
          "0%": {
            "-webkit-backdrop-filter": "blur(0px)",
            "backdrop-filter": "blur(0px)",
          },
          "100%": {
            "-webkit-backdrop-filter": "blur(var(--glass-blur))",
            "backdrop-filter": "blur(var(--glass-blur))",
          },
        },
        "glass-border": {
          "0%": { width: "2px", height: "2px" },
          "100%": { width: "100%", height: "100%" },
        },
        "glass-shine": {
          "0%": { left: "-50%" },
          "100%": { left: "150%" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "glass-blur": "glass-blur 0.5s forwards",
        "glass-border": "glass-border 0.3s forwards",
        "glass-shine": "glass-shine 2s linear infinite",
      },
      transitionTimingFunction: {
        smooth: "var(--transition-smooth)",
        spring: "var(--transition-spring)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
