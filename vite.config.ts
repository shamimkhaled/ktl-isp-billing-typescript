import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/api": {
        target: "https://ktl-isp-billing-app-qza33.ondigitalocean.app",
        changeOrigin: true,
        secure: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
            // Add headers to handle CORS
            proxyReq.setHeader(
              "Origin",
              "https://ktl-isp-billing-app-qza33.ondigitalocean.app"
            );
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
  build: {
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["lucide-react", "sonner"],
          state: ["@reduxjs/toolkit", "react-redux"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          query: ["@tanstack/react-query"],
        },
      },
    },
    // Enable source maps for production debugging
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Minify for smaller bundle
    minify: "terser",
    // Performance optimizations
    target: "esnext",
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
  // Performance optimizations
  esbuild: {
    // Remove console.log in production
    drop: ["console", "debugger"],
    // Minify identifiers
    minifyIdentifiers: true,
    // Minify syntax
    minifySyntax: true,
  },
});
