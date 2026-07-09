// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

// Marketing pages stay prerendered (static). API routes opt into on-demand
// rendering via `export const prerender = false`, which the Vercel adapter
// serves as serverless functions (checkout + Polar webhook).
export default defineConfig({
  output: "static",
  adapter: vercel(),
  vite: {
    envDir: ".",
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["ogl"],
    },
  },
});
