import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import netlify from "@netlify/vite-plugin";

function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

export default defineConfig({
  plugins: [figmaAssetResolver(), react(), tailwindcss(), netlify()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  assetsInclude: ["**/*.svg", "**/*.csv"],
  build: {
    // Raise the warning threshold so CI stays clean after splitting
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — cached aggressively; changes rarely
          "vendor-react": ["react", "react-dom"],

          // Routing
          "vendor-router": ["react-router"],

          // Redux + RTK Query
          "vendor-redux": ["@reduxjs/toolkit", "react-redux"],

          // Radix UI primitives (large; split from app code)
          "vendor-radix": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-context-menu",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-hover-card",
            "@radix-ui/react-label",
            "@radix-ui/react-menubar",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toggle",
            "@radix-ui/react-toggle-group",
            "@radix-ui/react-tooltip",
          ],

          // Charts — only needed on the analytics page
          "vendor-charts": ["recharts"],

          // ReactFlow canvas — only needed when canvas overlay opens
          "vendor-flow": ["reactflow"],

          // Animation library
          "vendor-motion": ["motion"],

          // Icon set (tree-shaken by Rollup, but isolating helps caching)
          "vendor-icons": ["lucide-react"],

          // Date utilities
          "vendor-dates": ["date-fns"],

          // Form / validation
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],

          // MUI (used for a small number of icons — isolate the large dep)
          "vendor-mui": [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
          ],
        },
      },
    },
  },
});
