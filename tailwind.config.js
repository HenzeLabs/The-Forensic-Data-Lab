/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./website/**/*.{html,js}",
    "./client-portal/**/*.{html,js}",
    "./marketing/**/*.{html,js}",
    "./operations/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#f8f9fa",
          100: "#f1f3f5",
          200: "#e9ecef",
          300: "#dee2e6",
          400: "#adb5bd",
          500: "#868e96",
          600: "#495057",
          700: "#343a40",
          800: "#212529",
          900: "#0d1117",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          lighter: "rgba(255, 255, 255, 0.15)",
        },
      },
      backdropBlur: {
        xl: "20px",
        "2xl": "40px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-lg": "0 0 40px rgba(59, 130, 246, 0.4)",
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(135deg, #0d1117 0%, #1a1f26 100%)",
        "gradient-accent": "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        "gradient-cool": "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
      },
    },
  },
  plugins: [],
};
