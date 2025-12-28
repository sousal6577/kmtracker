import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    // Configuração para Codespace - permite conexões externas
    allowedHosts: 'all',
    hmr: {
      // HMR funciona corretamente no Codespace
      clientPort: 443,
      protocol: 'wss'
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3005',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 5173,
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  define: {
    'process.env': {}
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
