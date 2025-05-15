import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'public/index.html'),
        about: resolve(__dirname, 'public/about.html'),
        app: resolve(__dirname, 'public/app.html'),
      }
    }
  }
})
