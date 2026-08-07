/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "var(--navy)",
          deep: "var(--navy-deep)",
          soft: "var(--navy-soft)",
          line: "var(--navy-line)",
        },
        orange: {
          DEFAULT: "var(--orange)",
          deep: "var(--orange-deep)",
          tint: "var(--orange-tint)",
          ring: "var(--orange-ring)",
        },
        bg: "var(--bg)",
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
        },
        fg: {
          DEFAULT: "var(--fg)",
          muted: "var(--fg-muted)",
          subtle: "var(--fg-subtle)",
        },
        "on-navy": {
          DEFAULT: "var(--on-navy)",
          muted: "var(--on-navy-muted)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
        },
        success: { DEFAULT: "var(--success)", tint: "var(--success-tint)" },
        star: "var(--star)",
        sale: "var(--sale)",
      },
      fontFamily: {
        display: ["Roboto", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      maxWidth: {
        shell: "1280px",
      },
    },
  },
  plugins: [],
};
