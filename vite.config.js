import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import postcssNesting from "postcss-nesting";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/good-soup/",
  css: {
    postcss: {
      plugins: [postcssNesting],
    },
  },
  plugins: [
    react(),
    VitePWA({
      // generates 'manifest.webmanifest' file on build
      manifest: {
        // caches the assets/icons mentioned (assets/* includes all the assets present in your src/ directory)
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "assets/*"],
        name: "Good Soup",
        short_name: "Good Soup",
        start_url: "/good-soup/",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "icon.png",
            sizes: "700x700",
            type: "image/png",
          },
        ],
      },
      workbox: {
        // defining cached files formats
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
      },
    }),
  ],
});
