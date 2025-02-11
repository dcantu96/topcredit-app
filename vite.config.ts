import { defineConfig } from "vite"
import { resolve } from "path"
import react from "@vitejs/plugin-react"

export default defineConfig((configEnv) => {
  const isDevelopment = configEnv.mode === "development"

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/oauth": {
          // Match the path you're requesting
          target: "http://localhost:4000", // Your backend's address
          changeOrigin: true, // Important for virtual hosted sites (usually needed)
          // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove /api prefix
        },
        // Add more proxies if you have other API endpoints
        "/api": {
          target: "http://localhost:4000",
          changeOrigin: true,
        },
      },
      host: "0.0.0.0", // Listen on all network interfaces (important for mobile access)
      port: 3000, // Or whichever port your Vite app uses
    },
    test: {
      globals: true,
      environment: "happy-dom",
      setupFiles: "./src/infrastructure/tests.setup.ts",
    },
    resolve: {
      alias: {
        app: resolve(__dirname, "src", "app"),
        components: resolve(__dirname, "src", "components"),
        hooks: resolve(__dirname, "src", "hooks"),
        routes: resolve(__dirname, "src", "routes"),
      },
    },
    css: {
      modules: {
        generateScopedName: isDevelopment
          ? "[name]__[local]__[hash:base64:5]"
          : "[hash:base64:5]",
      },
    },
  }
})
