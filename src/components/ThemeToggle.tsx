/**
 * ThemeToggle.tsx
 *
 * Skiper4 — "Theme Toggle Button" variant 2 (ThemeToggleButton2), recreated for
 * this project: the original uses Tailwind + `@/lib/utils` cn(); this project
 * has neither, so it's reimplemented with inline styles and the project's
 * `motion/react`. Wired as a real light/dark theme toggle:
 *   - default theme is dark;
 *   - choice persists in localStorage ("theme");
 *   - toggles document.documentElement.dataset.theme between "dark"/"light".
 *
 * The animated sun/moon icon is the same shape/animation as Skiper4 variant 2.
 */

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Sync from the theme set by the inline head script (light is the default).
  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setIsDark(current === "dark");
  }, []);

  const apply = (dark: boolean) => {
    const theme = dark ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* ignore storage errors */
    }
  };

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      apply(next);
      return next;
    });
  };

  const ease = { ease: "easeInOut", duration: 0.35 } as const;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      title="Toggle theme"
      style={{
        position: "fixed",
        top: 18,
        right: 18,
        zIndex: 60,
        width: 46,
        height: 46,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        borderRadius: 999,
        cursor: "pointer",
        color: "var(--text)",
        background: "color-mix(in srgb, var(--surface-2) 86%, transparent)",
        border: "1px solid var(--border)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.28)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        transition: "transform 200ms ease, border-color 200ms ease, background 200ms ease",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.94)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        aria-hidden="true"
        fill="currentColor"
        strokeLinecap="round"
        viewBox="0 0 32 32"
      >
        <clipPath id="theme-toggle-2">
          <motion.path
            animate={{ y: isDark ? 10 : 0, x: isDark ? -12 : 0 }}
            transition={ease}
            d="M0-5h30a1 1 0 0 0 9 13v24H0Z"
          />
        </clipPath>
        <g clipPath="url(#theme-toggle-2)">
          <motion.circle
            animate={{ r: isDark ? 10 : 8 }}
            transition={ease}
            cx="16"
            cy="16"
          />
          <motion.g
            animate={{
              rotate: isDark ? -100 : 0,
              scale: isDark ? 0.5 : 1,
              opacity: isDark ? 0 : 1,
            }}
            transition={ease}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M16 5.5v-4" />
            <path d="M16 30.5v-4" />
            <path d="M1.5 16h4" />
            <path d="M26.5 16h4" />
            <path d="m23.4 8.6 2.8-2.8" />
            <path d="m5.7 26.3 2.9-2.9" />
            <path d="m5.8 5.8 2.8 2.8" />
            <path d="m23.4 23.4 2.9 2.9" />
          </motion.g>
        </g>
      </svg>
    </button>
  );
}
