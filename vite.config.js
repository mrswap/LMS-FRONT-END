import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5000
  },
  optimizeDeps: {
    include: ["quill", "react-quilljs"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
