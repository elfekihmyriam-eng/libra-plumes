import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚙️ Configuration du proxy pour le backend
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
