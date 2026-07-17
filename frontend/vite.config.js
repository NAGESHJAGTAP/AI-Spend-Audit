// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Forward /api/* calls to the Express backend
      '/api': {
        target: process.env.VITE_API_URL
          ? process.env.VITE_API_URL.replace(/\/[\s\S]*$/, '')
          : 'https://ai-spend-audit-2-qijt.onrender.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
