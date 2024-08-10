import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import checker from 'vite-plugin-checker'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
      }
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/7winds',
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name?.split('.').at(-1)
          const fileName = '[name]-[hash]'
          if (extType) {
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img'
            } else if (/woff|woff2|ttf|otf/i.test(extType)) {
              extType = 'fonts'
            } else if (/js|mjs/i.test(extType)) {
              extType = 'scripts'
            }
          }
          return `assets/${extType}/${fileName}.[ext]`
        },
        entryFileNames: 'assets/scripts/[name]-[hash].js',
      },
    },
  },
})
