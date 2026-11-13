import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Exposes Vite to local network (0.0.0.0) so phone can connect
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3069',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
