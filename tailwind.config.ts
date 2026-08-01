import type { Config } from "tailwindcss";

/**
 * Tailwind is bridged onto the same CSS custom properties that the semantic
 * stylesheet layer uses (src/styles/tokens.*.css). Utilities and semantic
 * classes therefore cannot drift apart, and no raw values live here.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
      colors: {
        canvas: {
          DEFAULT: "var(--color-canvas)",
          subtle: "var(--color-canvas-subtle)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          elevated: "var(--color-surface-elevated)",
          inverse: "var(--color-surface-inverse)",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          muted: "var(--color-ink-muted)",
          subtle: "var(--color-ink-subtle)",
          inverse: "var(--color-ink-inverse)",
        },
        line: {
          DEFAULT: "var(--color-line)",
          strong: "var(--color-line-strong)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          on: "var(--color-accent-on)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        info: "var(--color-info)",
        focus: "var(--color-focus)",
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        7: "var(--space-7)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        12: "var(--space-12)",
        14: "var(--space-14)",
        16: "var(--space-16)",
        20: "var(--space-20)",
        24: "var(--space-24)",
        32: "var(--space-32)",
      },
      maxWidth: {
        container: "var(--container-max)",
        narrow: "var(--container-narrow)",
        hero: "var(--measure-hero)",
        editorial: "var(--measure-editorial)",
        operational: "var(--measure-operational)",
        legal: "var(--measure-legal)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        panel: "var(--radius-panel)",
        pill: "var(--radius-pill)",
      },
      transitionDuration: {
        instant: "var(--motion-instant)",
        interface: "var(--motion-interface)",
        editorial: "var(--motion-editorial)",
        ambient: "var(--motion-ambient)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        enter: "var(--ease-enter)",
        exit: "var(--ease-exit)",
        emphasized: "var(--ease-emphasized)",
        ambient: "var(--ease-ambient)",
      },
    },
  },
  plugins: [],
} satisfies Config;
