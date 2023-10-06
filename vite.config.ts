import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx"
import eslintPlugin from "vite-plugin-eslint";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        eslintPlugin()
    ],
    css: {
        preprocessorOptions: {
            extract: true,
            scss: {
                additionalData: `@import "./src/css/variables";`,
                sassOptions: {
                    queueMicrotask: true,
                    module: true
                }
            },
        },
    },
    build: {
        rollupOptions: {
            input: {
                background: path.resolve("src/background.ts"),
                app: path.resolve("index.html")
            },
            output: {
                chunkFileNames: "assets/[ext]/[name]-[hash].[ext]",
                assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
                entryFileNames: (file) => (file.name == "background" ? "assets/js/[name].js" : "assets/js/[name]-[hash].js")
            }
        }
    },
    resolve: {
        alias: {
            "@": path.resolve("src")
        }
    }
})
