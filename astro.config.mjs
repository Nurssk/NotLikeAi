import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [react()],
  vite: {
    // Ensure a single React instance across all islands + deps (firebase, motion).
    // Without this, Vite's dep pre-bundling can load a second copy of React,
    // which throws "Invalid hook call" and prevents React islands (the waitlist
    // button) from hydrating.
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react/jsx-runtime", "motion/react"],
    },
  },
});
