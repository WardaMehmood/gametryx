/**
 * vite.pages.config.ts
 *
 * Pure client-side Vite build for GitHub Pages.
 * No TanStack Start / SSR — just React + TanStack Router Plugin + Tailwind.
 * Generates: dist/pages/
 * Entry:      index.pages.html  →  src/main.pages.tsx
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  base: "/gametryx/",

  plugins: [
    // Generates src/routeTree.pages.gen.ts (no ssr:true)
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.pages.gen.ts",
      routeFileIgnorePrefix: "-",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },

  build: {
    outDir: "dist/pages",
    emptyOutDir: true,
    rollupOptions: {
      input: "index.pages.html",
    },
  },
});
